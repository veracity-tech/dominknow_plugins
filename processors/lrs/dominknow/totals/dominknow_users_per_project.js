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
module.exports = class UsersPerProject extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);

        this.pipeline = [
            ...CommonStages(this, {
                range: true,
                limit: true,
            }),
            {
                $match: {
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/course',
                },
            },
            {
                $group: {
                    _id: {
                        project: '$statement.object.definition.name.en-US',
                        actor: '$statement.actor.id',
                    },
                },
            },
            {
                $group: {
                    _id: '$_id.project',
                    count: {
                        $sum: 1,
                    },

                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
        ];

        this.chartSetup = new BarChart('_id', 'count');
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Users Per Project', ProcessorConfiguration.widgetType.graph, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
