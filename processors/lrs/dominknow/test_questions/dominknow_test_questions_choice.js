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
module.exports = class QuestionOverview extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {
                $match: {
                    // 'statement.object.definition.interactionType': 'choice',
                    'statement.context.contextActivities.parent.id': this.param('testId'),
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    'statement.object.id': this.param('question'),
                },
            },
            {
                $group: {
                    _id: 1,
                    count: {
                        $sum: 1,
                    },
                    def: {
                        $last: '$statement.object.definition',
                    },
                },
            },
        ];
    }
    exec(data) {
        const res = [{
            icon: 'fa-question',
            title: data[0].def.name['en-US'],
            subtext: data[0].def.description['en-US'],
        },
        {
            icon: 'fa-edit',
            title: data[0].def.interactionType,
            subtext: 'Question Type, child of cmi.interaction',
        },
        {
            icon: 'fa-slack',
            title: this.param('question'),
            subtext: 'Object Identifier',
        }];
        if (data[0].def.interactionType === 'choice') {
            const choices = data[0].def.choices;
            let correct = data[0].def.correctResponsesPattern;
            if (correct) { correct = correct[0].split(','); }
            for (const i in choices) {
                let icon = 'fa-arrow-up';
                let color = 'green';
                let subtext = '';

                if (correct) {
                    if (correct.findIndex((j) => j === choices[i].id) > -1) {
                        icon = 'fa-check';
                        color = 'green';
                        subtext = 'Correct: ';
                    } else {
                        icon = 'fa-ban';
                        color = 'red';
                        subtext = 'Incorrect: ';
                    }
                }
                res.push({
                    icon: icon,
                    color: color,
                    title: 'Response: ' + choices[i].description['en-US'],
                    subtext: subtext + choices[i].id,
                });
            }
        }
        return res;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Question Overview', ProcessorConfiguration.widgetType.iconList, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        conf.addParameter('question', new ActivityPicker('Activity', 'Choose the activity to plot'), true);
        return conf;
    }
};
