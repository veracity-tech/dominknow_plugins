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
module.exports = class CompsInProject extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {
                $match: {
                    'statement.context.contextActivities.parent.id': this.param('comp'),
                    'statement.object.definition.type': "http://adlnet.gov/expapi/activities/cmi.interaction",
                },
            },
            {
                $group: {
                    _id: '$statement.object.id',
                    name: {
                        $last: '$statement.object.definition.name.en-US',
                    },
                    type: {
                        $last: '$statement.object.definition.interactionType',
                    },
                },
            },
            {
                $project: {
                    icon: 'fa-question',
                    title: '$name',
                    subtext: '$type',
                },
            },
        ];
    }
    exec(data) {
        for(let i in data)
        {
            data[i].subtext += " - " + data[i]._id;
        }
        data.unshift({
            icon: 'fa-check',
            title: this.param('title'),
            subtext: "Questions within " + this.param('comp'),
        })
        return data;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Questions for Learning Object', ProcessorConfiguration.widgetType.iconList, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        conf.addParameter('question', new ActivityPicker('Activity', 'Choose the activity to plot'), true);
        return conf;
    }
};
