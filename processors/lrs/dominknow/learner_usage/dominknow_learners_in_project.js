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
module.exports = class dominknow_learners_in_project extends AnalyticProcessor {
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
                    'statement.context.contextActivities.parent.id': this.param('projectId'),
                },
            },
            {
                $group: {
                    _id: '$statement.actor.id',
                    count: {
                        $sum: 1,
                    },
                    name: {
                        $last: '$statement.actor.name',
                    },
                },
            },
            {
                $count: 'count',
            },

        ];
    }
    exec(values) {
        if (!values) return;
        [
            {
                icon: 'fa-user',
                change: '0 Learners attempted this project',
                subtext: 'Number of unique learners in this project',

            },
        ];

        return [
            {
                icon: 'fa-user',
                change: `${values[0].count} Total Learners`,
                subtext: 'Number of unique learners who attempted this project',

            },
        ];
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Total Unique Learners', ProcessorConfiguration.widgetType.progressChange, ProcessorConfiguration.widgetSize.medium);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
