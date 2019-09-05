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
module.exports = class MyProcessor extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);
        console.log('Wow, in the  derived constructor!');

        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {
                $match: {
                    'statement.object.id': this.param('activity'),
                },
            },
            {
                $limit: 1000,
            },
            {
                $group: {
                    _id: '$statement.actor.id',
                    count: {
                        $sum: 1,
                    },
                },
            },
        ];

        this.chartSetup = new BarChart('_id', 'count');
        this.map = MapToActorNameAsync('_id');
    }
    map(val) {
        //  console.log(val);
        return val;
    }
    filter(val) {
        return Math.random() > 0.5;
    }
    exec(results) {
        return results;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Demo', ProcessorConfiguration.widgetType.graph, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('activity', new ActivityPicker('Activity', 'Choose the activity to plot'), true);
        return conf;
    }
};
