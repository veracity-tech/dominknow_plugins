/** ***********************************************************************
*
* Veracity Technology Consultants CONFIDENTIAL
* __________________
*
*  2019 Veracity Technology Consultants
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Veracity Technology Consultants and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Veracity Technology Consultants
* and its suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Veracity Technology Consultants.
*/

class CustomDash extends Dashboard {
    constructor(params, db, lrs) {
        super(params, db, lrs);
    }

    async getGraphs() {
        const allComps = await this.db.collection('statements').aggregate([
            {
                $match: {
                    'statement.context.contextActivities.parent.id': this.param('projectId'),
                    'statement.verb.id': 'http://activitystrea.ms/schema/1.0/complete',
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/objective',
                },
            },
            {
                $group: {
                    _id: '$statement.object.id',
                    name: {
                        $last: '$statement.object.definition.name.en-US',
                    },
                    description: {
                        $last: '$statement.object.definition.description.en-US',
                    },
                },
            },
            {
                $project: {
                    icon: 'fa-check',
                    title: '$name',
                    subtext: '$description',
                },
            },
        ]).toArray();

        const graphs = [
            {
                handler: 'dominknow_comps_in_project',
                params: {
                    projectId: this.param('projectId'),
                },
            },
        ];
        for (const i in allComps) {
            graphs.push({
                handler: 'dominknow_learners_with_comp',
                params: {
                    comp: allComps[i]._id,
                    title: allComps[i].title,
                },
            });
            graphs.push({
                handler: 'dominknow_questions_for_comp',
                params: {
                    comp: allComps[i]._id,
                    title: allComps[i].title,
                },  
            });
        }
        return graphs;
    }

    static getConfiguration() {
        return {
            TTL: '60 minutes',
            parameters: {
                range: new TimeRange('Time Range', ''),
                projectId: {
                    title: 'Project',
                    type: 'autoComplete',
                    required: true,
                    valKey: 'id',
                    textKey: 'display',
                    serviceInverse: 'dominknow_search_projects',
                    service: 'dominknow_search_projects',
                },
            },
            title: 'DominKnow: Project Competencies',
            defaultLoaded: false,
            defaults: {
                range: 'last90days',
            },
            allowedProcessors: [
                'dominknow_comps_in_project',
                'dominknow_questions_for_comp',
                'dominknow_learners_with_comp',
                'dominknow_search_projects',

            ],
        };
    }
}

module.exports = CustomDash;
