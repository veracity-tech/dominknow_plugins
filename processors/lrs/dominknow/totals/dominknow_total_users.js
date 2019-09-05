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
module.exports = class TotalUsers extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);

        this.pipeline = [
            ...CommonStages(this, {
                range: true,
                limit: true,
            }),

            {
                $group: {
                    _id: '$statement.actor.id',
                    count: {
                        $sum: 1,
                    },

                },
            },
            {
                $count: 'count',
            },
            {
                $project: {
                    icon: 'fa-user',
                    change: {
                        $concat: [{ $toString: '$count' }, ' Total Unique Learners'],
                    },
                    subtext: 'Number of unique learners across all projects',
                },
            },
        ];
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Unique Users', ProcessorConfiguration.widgetType.progressChange, ProcessorConfiguration.widgetSize.large);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
