<template>
<div class="metabox-holder">
    <div id="cpm_general" class="group" style="">
        <form method="post" action="options.php">
            <h2>General Settings</h2>
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[upload_limit]">File Upload Limit</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text">
                            <p class="description">File Size in Megabytes. e.g: 2</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[pagination]">Projects Per Page</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text">
                            <p class="description">-1 for unlimited</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[todolist_show]">Task List Style</label>
                        </th>
                        <td>
                            <fieldset>
                                <label for="wpuf-cpm_general[todolist_show][pagination]">
                                    <input type="radio" class="radio" checked="checked">
                                    Pagination
                                </label>
                                <br>
                                 <label for="wpuf-cpm_general[todolist_show][load_more]">
                                    <input type="radio" class="radio" id="wpuf-cpm_general[todolist_show][load_more]" name="cpm_general[todolist_show]" value="load_more">
                                    Load More...
                                </label>
                                <br>
                                <label for="wpuf-cpm_general[todolist_show][lazy_load]">
                                    <input type="radio" class="radio" id="wpuf-cpm_general[todolist_show][lazy_load]" name="cpm_general[todolist_show]" value="lazy_load">Lazy Load
                                </label>
                                <br>
                            </fieldset>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[show_todo]">Task Lists Per Page</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text" id="cpm_general[show_todo]" name="cpm_general[show_todo]" value="2">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[show_incomplete_tasks]">Incomplete Tasks Per Page</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text" id="cpm_general[show_incomplete_tasks]" name="cpm_general[show_incomplete_tasks]" value="2">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[show_completed_tasks]">Completed Tasks Per Page</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text" id="cpm_general[show_completed_tasks]" name="cpm_general[show_completed_tasks]" value="2">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="cpm_general[project_manage_role]">Project Managing Capability</label>
                        </th>
                        <td>
                            <fieldset>
                                <label for="wpuf-cpm_general[project_manage_role][administrator]">
                                    <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_manage_role][administrator]" name="cpm_general[project_manage_role][administrator]" value="administrator" checked="checked">Administrator
                                </label>
                                <br>
                                <label for="wpuf-cpm_general[project_manage_role][editor]">
                                    <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_manage_role][editor]" name="cpm_general[project_manage_role][editor]" value="editor" checked="checked">Editor</label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_manage_role][author]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_manage_role][author]" name="cpm_general[project_manage_role][author]" value="author" checked="checked">Author
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_manage_role][contributor]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_manage_role][contributor]" name="cpm_general[project_manage_role][contributor]" value="contributor">Contributor
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_manage_role][subscriber]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_manage_role][subscriber]" name="cpm_general[project_manage_role][subscriber]" value="subscriber" checked="checked">Subscriber
                                    </label>
                                    <br>
                                    <p class="description">Select the user roles who can see and manage all projects.</p>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="cpm_general[project_create_role]">Project Creation Capability</label>
                            </th>
                            <td>
                                <fieldset>
                                    <label for="wpuf-cpm_general[project_create_role][administrator]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_create_role][administrator]" name="cpm_general[project_create_role][administrator]" value="administrator" checked="checked">Administrator
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_create_role][editor]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_create_role][editor]" name="cpm_general[project_create_role][editor]" value="editor" checked="checked">Editor
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_create_role][author]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_create_role][author]" name="cpm_general[project_create_role][author]" value="author" checked="checked">Author
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_create_role][contributor]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_create_role][contributor]" name="cpm_general[project_create_role][contributor]" value="contributor">Contributor
                                    </label>
                                    <br>
                                    <label for="wpuf-cpm_general[project_create_role][subscriber]">
                                        <input type="checkbox" class="checkbox" id="wpuf-cpm_general[project_create_role][subscriber]" name="cpm_general[project_create_role][subscriber]" value="subscriber">Subscriber
                                    </label>
                                    <br>
                                    <p class="description">Select the user roles who can create projects.</p>
                                </fieldset>
                            </td>
                        </tr>
                </tbody>
            </table>                            
            <div style="padding-left: 10px">
                <p class="submit">
                    <input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
                </p>                            
            </div>
        </form>
    </div>
</div>
</template>