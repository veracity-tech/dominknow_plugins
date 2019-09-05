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
module.exports = class dominknow_project_total_duration extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: true,
                limit: true,
            }),
            {
                $match: {
                    'statement.verb.id': 'http://adlnet.gov/expapi/verbs/completed',
                    'statement.object.id': this.param('projectId'),
                },
            },
            {
                $group: {
                    _id: 1,
                    duration: {
                        $sum: '$duration',
                    },
                },
            },
        ];
    }
    exec(values) {
        const moment = require('moment');
        const momentDurationFormatSetup = require('moment-duration-format');
        momentDurationFormatSetup(moment);
        if (!values[0].duration) return [];
        const durationdisplay = moment.duration(values[0].duration).format('h:mm:ss');

        return [
            {
                icon: 'fa-clock-o',
                change: durationdisplay + 's',
                subtext: 'Total time spent in the project',
            },
        ];
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Total Time Spent', ProcessorConfiguration.widgetType.progressChange, ProcessorConfiguration.widgetSize.medium);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
