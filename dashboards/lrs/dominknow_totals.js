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
        return [{
            handler: 'dominknow_total_projects',
            params: {

            },

        },
        {
            handler: 'dominknow_users_per_project',
            params: {

            },

        },
        {
            handler: 'dominknow_total_users',
            params: {

            },

        },
        {
            handler: 'dominknow_total_os',
            params: {

            },

        },
        {
            handler: 'dominknow_total_browser',
            params: {

            },

        },
        {
            handler: 'dominknow_total_platform',
            params: {

            },

        },

        ];
    }

    static getConfiguration() {
        return {
            TTL: '60 minutes',
            parameters: {
                range: new TimeRange('Time Range', ''),
            },
            title: 'DominKnow: Totals',
            defaultLoaded: false,
            defaults: {
                range: 'last90days',
            },
            allowedProcessors: ['dominknow_total_projects', 'dominknow_users_per_project', 'dominknow_total_users', 'dominknow_total_os', 'dominknow_total_browser', 'dominknow_total_platform'],
        };
    }
}

module.exports = CustomDash;
