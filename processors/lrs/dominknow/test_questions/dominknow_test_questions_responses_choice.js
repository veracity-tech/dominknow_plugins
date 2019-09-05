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
module.exports = class dominknow_test_questions_responses_choice extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {// testMode
                $match: {
                    'statement.object.definition.interactionType': 'choice',
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

        this.chartSetup = new PieChart('_id', 'count');
    }
    exec(data) {
        if (data.length == 0) return data;
        const def = data[0].def;
        this.title = def.name['en-US'];
        const choices = def.choices;

        // create data entries for responses that have 0 answers
        for (const i in choices) {
            let found = false;
            for (const j in data) {
                if (data[j]._id == choices[i].id) found = true;
            }
            if (!found) {
                data.push({
                    _id: choices[i].id,
                    count: 0,
                });
            }
        }



        let correct = data[0].def.correctResponsesPattern;
        if (correct) { correct = correct[0].split(','); }

        this.chartSetup.series[0].colors = { list: [] };
        for (const i in data) {
            const response = data[i]._id;

            if (correct.findIndex((t) => t === response) > -1) {
                this.chartSetup.series[0].colors.list.push('#0fbd66');
            } else {
                this.chartSetup.series[0].colors.list.push(`rgb(${Math.floor(Math.random() * 55) + 200}, 85, 85)`);
            }

            for (const j in choices) {
                if (choices[j].id === response) {
                    data[i]._id = choices[j].description['en-US'];
                }
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
