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
module.exports = class dominknow_test_questions_responses_truefalse extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {// testMode
                $match: {
                    'statement.object.definition.interactionType': 'true-false',
                    'statement.context.contextActivities.parent.id': this.param('testId'),
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    'statement.object.id': this.param('question'),
                    'statement.object.definition.extensions.http://dominknow*`*com/testMode': this.param('testMode') && this.param('testMode').length > 0 ? this.param('testMode') : undefined,
                },
            },
            {
                $group: {
                    _id: '$statement.result.response',
                    count: {
                        $sum: 1,
                    },
                    def: {
                        $last: '$statement.object.definition',
                    },
                },
            },
        ];

        this.chartSetup = new BarChart('_id', 'count');
    }
    exec(data) {
        this.chartSetup.colors = { list: [] };
        const correct = data[0].def.correctResponsesPattern[0];
        for (const i in data) {
            if (data[i]._id == correct) {
                this.chartSetup.colors.list.push('#0fbd66');
            } else {
                this.chartSetup.colors.list.push(`rgb(${Math.floor(Math.random() * 55) + 200}, 85, 85)`);
            }
        }
        return data;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Question Overview', ProcessorConfiguration.widgetType.graph, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        conf.addParameter('question', new ActivityPicker('Activity', 'Choose the activity to plot'), true);
        conf.addParameter('testMode', new Text('Activity', 'Choose the activity to plot'), true);
        return conf;
    }
};
