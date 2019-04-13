<template>
    <v-app dark>
        <v-navigation-drawer
                fixed
                app
                dark
                :mini-variant="mini"
        >
            <v-container fluid display-1 font-weight-black text-uppercase>
                <v-layout>
                    <v-flex layout justify-center align-center>
                        <!--<v-icon>credit_card</v-icon>-->
                        <div>PocketBook</div>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-list>
                <template v-for="(item, i) in items">
                    <v-layout
                            row
                            v-if="item.heading"
                            align-center
                            :key="i"
                    >
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-right" v-if="item.heading === 'Task'">
                            <v-btn small flat>Add</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-divider
                            dark
                            v-else-if="item.divider"
                            class="my-3"
                            :key="i"
                    >
                    </v-divider>
                    <v-list-tile
                            :to="item.to"
                            :key="i"
                            v-else-if="item.isSingle"
                            @click=""
                    >
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-group
                            v-else-if="item.isGroup"
                            :prepend-icon="item.icon"
                            no-action
                            @click="mini = false"
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                                v-for="subItem in item.items"
                                :key="subItem.text"
                                @click=""
                        >
                            <v-list-tile-content>
                                <v-list-tile-title>{{ subItem.text }}</v-list-tile-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list-group>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed>
            <v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height grid-list-md>
                <router-view></router-view>
                <v-btn
                        color="orange"
                        fixed
                        bottom
                        right
                        fab

                >
                    <v-icon>add</v-icon>
                </v-btn>
            </v-container>
        </v-content>
        <v-footer app fixed inset>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            drawer: null,
            items: [
                {heading: 'Task'},
                {isSingle: true, icon: 'list', text: 'Task List', to: '/task'},
                {heading: 'Manager'},
                {
                    isGroup: true,
                    icon: 'list',
                    text: 'Task Manager',
                    items: [
                        {icon: '', text: 'Week Statistics'},
                        {icon: '', text: 'Month Statistics'},
                        {icon: '', text: 'Year Statistics'},
                        {icon: '', text: 'File Manager'}
                    ]
                },
                {divider: true},
                {heading: 'System'},
                {isSingle: true, icon: 'settings', text: 'Settings', to: '/settings'},
                {isSingle: true, icon: 'lightbulb_outline', text: 'Notes', to: '/notes'},
                {isSingle: true, icon: 'help', text: 'Help', to: '/help'}
            ],
            mini: false,
            right: null
        }),
        methods: {

        }
    }
</script>

<style>
    /*h1*/
    /*opacity: 0.3*/
    /*.v-text-field .v-input__slot*/
    /*padding: 0 !important*/
</style>
