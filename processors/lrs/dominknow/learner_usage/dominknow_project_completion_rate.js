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
module.exports = class dominknow_project_completion_rate extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: true,
                limit: true,
            }),
            {
                $match: {
                    'statement.verb.id': {
                        $in: ['http://adlnet.gov/expapi/verbs/attempted', 'http://adlnet.gov/expapi/verbs/completed'],
                    },
                    'statement.object.id': this.param('projectId'),
                },
            },
            {
                $group: {
                    _id: '$statement.verb.id',
                    count: {
                        $sum: 1,
                    },
                },
            },
        ];
    }
    exec(values) {
        let complete = 0;
        let attempt = 0;

        for (const i in values) {
            if (values[i]._id == 'http://adlnet.gov/expapi/verbs/attempted') { attempt = values[i].count; }
            if (values[i]._id == 'http://adlnet.gov/expapi/verbs/completed') { complete = values[i].count; }
        }

        return [
            {

                icon: 'fa-check',
                change: Math.floor((complete / attempt) * 100) + '%',
                subtext: 'Percent of sessions that are completed.',

            },
        ];
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Completion Rate', ProcessorConfiguration.widgetType.progressChange, ProcessorConfiguration.widgetSize.medium);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
