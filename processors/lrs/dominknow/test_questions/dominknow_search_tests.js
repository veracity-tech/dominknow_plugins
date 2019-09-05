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


module.exports = class searchTests extends AnalyticProcessor {
    constructor(parameters, db, lrs) {
        function escapeRegExp(text) {
            if (!text) return '.*';
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }


        super(parameters, db, lrs);
        const search = new RegExp(escapeRegExp(this.param('search')), 'ig');
        this.pipeline = [
            {
                $match: {
                    $or: [
                        {
                            display: search,
                        },
                        {
                            id: search,
                        },
                    ],
                    type: 'http://adlnet.gov/expapi/activities/module',
                },
            },
        ];
        this.getAggregateCollection = function() {
            return db.collection('canonicalActivities');
        };
    }

    static getConfiguration() {
        const conf = new ProcessorConfiguration('Search for Tests', ProcessorConfiguration.widgetType.iconList, ProcessorConfiguration.widgetSize.small);
        conf.addParameter('range', new TimeRange('Time Range', ''), true);
        return conf;
    }
};

