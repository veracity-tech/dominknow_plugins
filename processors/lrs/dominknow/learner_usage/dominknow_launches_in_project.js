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
module.exports = class dominknow_launches_in_project extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: true,
                limit: true,
            }),
            {
                $match: {
                    'statement.verb.id': 'http://adlnet.gov/expapi/verbs/attempted',
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/course',
                    'statement.context.contextActivities.parent.id': this.param('projectId'),
                },
            },

            {
                $count: 'count',
            },

        ];
    }
    exec(values) {
        console.log(values);
        return [
            {
                icon: 'fa-external-link',
                change: `${values[0].count} Total Launches`,
                subtext: 'Number of launches of this project',
            },
        ];
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Total Launches', ProcessorConfiguration.widgetType.progressChange, ProcessorConfiguration.widgetSize.medium);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
