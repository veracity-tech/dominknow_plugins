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

class CustomDash extends Dashboard {
    constructor(params, db) {
        super(params, db);
    }

    async getGraphs() {
        console.log("this.param('testId')", this.param('testId'));
        const statements = this.db.collection('statements');
        const questions = await statements.aggregate([
            {
                $match: {
                    'statement.context.contextActivities.parent.id': this.param('testId'),
                    'statement.object.definition.type': 'http://adlnet.gov/expapi/activities/cmi.interaction',
                },
            },
            {
                $group: {
                    _id: '$statement.object.id',
                    def: {
                        $last: '$statement.object.definition',
                    },
                },
            },

        ]).toArray();

        const widgets = [];
        for (const i in questions) {
            widgets.push({
                handler: 'dominknow_test_questions_choice',
                params: {
                    question: questions[i]._id,
                    testId: this.param('testId'),
                },
            });
        }


        return widgets;
    }

    static getConfiguration() {
        return {
            TTL: '60 minutes',
            parameters: {
                range: new TimeRange('Time Range', ''),
                testId: {
                    title: 'Test',
                    type: 'autoComplete',
                    required: true,
                    valKey: 'id',
                    textKey: 'display',
                    serviceInverse: 'dominknow_search_tests',
                    service: 'dominknow_search_tests',
                },

            },
            title: 'DominKnow: Test Questions',
            defaultLoaded: false,
            defaults: {
                range: 'last90days',
            },
            allowedProcessors: ['dominknow_search_tests', 'dominknow_test_questions_choice'],
        };
    }
}

module.exports = CustomDash;
