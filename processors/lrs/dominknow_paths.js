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
module.exports = class Paths extends AnalyticProcessor {
    constructor(params, db, lrs) {
        super(params, db, lrs);


        this.pipeline = [
            ...CommonStages(this, {
                range: false,
                limit: true,
            }),
            {
                // Just as an example, lets plot paths for started events where the parent is a given course
                $match: {
                    'statement.verb.id': 'http://activitystrea.ms/schema/1.0/start',
                    'statement.context.contextActivities.parent.id': 'https://enablement.authr.it/activities/course/101803',
                },
            },
            { // This block defines what makes up a session. In this case, we're using assuming every event by a given actor that matches the above query is on
                // the path. Note that that does not allow for the learner to try the whole course again.
                $group: {
                    _id: '$statement.actor.id',
                    path: {
                        $push: '$statement.object.id',
                    },

                },
            },
            // Because it's important which step a given module was in (ie, taking module B first is not the same taking it second), we can consider each module different if it occurs
            // in a different position. This names things uniquely by their order.
            {
                $project: {
                    path: {
                        $map: {
                            input: '$path',
                            as: 'this',
                            in: {
                                $concat: [
                                    'step-', { $toString: { $indexOfArray: ['$path', '$$this'] } }, ' ', '$$this',
                                ],
                            },
                        },
                    },
                },
            },
        ];
        // The AmCharts configuration
        this.chartSetup = { forWidgetType: 'graph', balloon: { borderThickness: 0, borderAlpha: 0, fillAlpha: 0, horizontalPadding: 0, verticalPadding: 0, shadowAlpha: 0 }, export: { enabled: true, fileName: 'Paths' }, type: 'SankeyDiagram', engine: 'amcharts4', paddingLeft: 20, paddingBottom: 20, dataFields: { fromName: 'source', toName: 'target', value: 'value' }, series: [], colors: { list: ['#00BBBB', '#006E6E', '#159800', '#001F7C', '#1FE200', '#0133C8', '#00BBBB', '#006E6E', '#159800', '#001F7C', '#1FE200', '#0133C8', '#00BBBB', '#006E6E', '#159800', '#001F7C', '#1FE200', '#0133C8'] }, links: { colorMode: 'gradient', fillOpacity: 0.2, strokeOpacity: 0, showSystemTooltip: true, tooltipText: '', property: { zIndex: 'zIndex' }, tension: 0.6 }, nodes: { fillOpacity: 0.2, tooltipText: '{from}', nameLabel: { disabled: true }, propertyFields: { name: 'target' }, tooltip: { text: 'target' } }, legend: {} };
    }
    exec(res) {
        // This whole bit is about computing the from/to at each stage. Not super interesting.
        // Would be great to express it in Mongo, but is not possible.
        const nodes = {};
        for (const i in res) {
            const path = res[i].path;
            for (const _j in path) {
                const j = parseInt(_j, 10);

                const id = path[j];
                if (!nodes[id]) {
                    nodes[id] =
                        {
                            id: id,
                            out: {},
                        };
                }
                const node = nodes[id];
                const next = path[j + 1];

                if (next) {
                    if (!node.out[next]) { node.out[next] = 0; }
                    node.out[next]++;
                }
            }
        }
        const data = [];
        for (const i in nodes) {
            for (const j in nodes[i].out) {
                data.push({
                    source: i,
                    target: j,
                    value: nodes[i].out[j],
                });
            }
        }

        return data;
    }
    static getConfiguration() {
        const conf = new ProcessorConfiguration('Paths', ProcessorConfiguration.widgetType.graph, ProcessorConfiguration.widgetSize.large);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};
