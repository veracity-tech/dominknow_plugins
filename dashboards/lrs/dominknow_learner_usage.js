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
    constructor(params, db) {
        super(params, db);
    }

    async getGraphs() {
        return [
            {
                handler: 'dominknow_learners_in_project',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_launches_in_project',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_completion_rate',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_average_duration',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_total_duration',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_os',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_browser',
                params: {
                    projectId: this.param('projectId'),
                },
            },
            {
                handler: 'dominknow_project_platform',
                params: {
                    projectId: this.param('projectId'),
                },
            },



        ];
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
            title: 'DominKnow: Learner Usage',
            defaultLoaded: false,
            defaults: {
                range: 'last90days',
            },
            allowedProcessors: ['dominknow_project_total_duration',
                'dominknow_learners_in_project',
                'dominknow_launches_in_project',
                'dominknow_search_projects',
                'dominknow_project_completion_rate',
                'dominknow_project_average_duration',
                'dominknow_project_os',
                'dominknow_project_browser',
                'dominknow_project_platform',
            ],
        };
    }
}

module.exports = CustomDash;
