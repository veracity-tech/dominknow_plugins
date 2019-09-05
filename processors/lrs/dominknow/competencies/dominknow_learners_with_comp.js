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
module.exports = class LearnersWithComp extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);

        this.title = this.param('title');
        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {
                $match: {

                    'statement.verb.id': 'http://www.dominknow.com/xapi/verbs/objective_complete',
                    'statement.object.id': this.param('comp'),
                },
            },
            {
                $group: {
                    _id: '$statement.actor.id',
                    name: {
                        $last: '$statement.actor.name',
                    },
                },
            },
            {
                $project: {
                    icon: 'fa-user',
                    title: '$_id',
                    subtext: '$name',
                },
            },
        ];
    }
    exec(data) {
        data.unshift({
            icon: 'fa-check',
            title: this.param('title'),
            subtext: this.param('comp'),
        });
        return data;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Users with Comp', ProcessorConfiguration.widgetType.iconList, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
