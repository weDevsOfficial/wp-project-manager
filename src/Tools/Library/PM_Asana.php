<?php
/**
 * A PHP class that acts as wrapper for Asana API. Lets make things easy! :)
 *
 * Read Asana API documentation for fully use this class https://asana.com/developers/api-reference/
 *
 * Copyright 2019 Ajimix
 * Licensed under the Apache License 2.0
 *
 * Author: Ajimix [github.com/ajimix] and the contributors [github.com/ajimix/asana-api-php-class/contributors]
 * Version: 6.4.0
 */
namespace WeDevs\PM\Tools\Library;
// Define some constants for later usage.
define('ASANA_METHOD_POST', 1);
define('ASANA_METHOD_PUT', 2);
define('ASANA_METHOD_GET', 3);
define('ASANA_METHOD_DELETE', 4);
define('ASANA_RETURN_TYPE_JSON', 1);
define('ASANA_RETURN_TYPE_OBJECT', 2);
define('ASANA_RETURN_TYPE_ARRAY', 3);

class PM_Asana
{
    public $fastAPI = false; // Use Asana fast API version, currently in open beta: https://asana.com/developers/feed/asana-fast-api-open-beta
    public $newRichText = true; // Use Asana new rich text formatting: https://asana.com/developers/feed/asana-fast-api-open-beta
    public $timeout = 10;
    public $failOnError = true; // If set to false, API won't fail on error (response code >= 400) and you can retrieve the errors with getErrors() method
    public $debug = false;
    public $advDebug = false; // Note that enabling advanced debug will include debugging information in the response possibly breaking up your code
    private $asanaApiVersion = '1.0';

    private $response;
    public $responseCode;
    private $returnType = ASANA_RETURN_TYPE_OBJECT;

    private $endPointUrl;
    private $apiKey;
    private $personalAccessToken;
    private $accessToken;
    private $tasksUrl;
    private $usersUrl;
    private $projectsUrl;
    private $workspacesUrl;
    private $teamsUrl;
    private $storiesUrl;
    private $tagsUrl;
    private $organizationsUrl;
    private $attachmentsUrl;
    private $customFieldsUrl;
    private $webhooksUrl;
    private $sectionsUrl;

    /**
     * Class constructor.
     *
     * @param array $options Array of options containing an apiKey OR a personalAccessToken OR an accessToken. Just one of them.
     *                       Can be also an string if you want to use an apiKey.
     */
    public function __construct($options)
    {
        // For retro-compatibility purposes check if $options is a string,
        // so if a user passes a string we use it as the app key.
        if (is_string($options)) {
            $this->apiKey = $options;
        } elseif (is_array($options) && !empty($options['apiKey'])) {
            trigger_error('API Key has been deprecated by Asana. Please use OAuth or Personal Access Tokens instead', E_USER_DEPRECATED);
            $this->apiKey = $options['apiKey'];
        } elseif (is_array($options) && !empty($options['personalAccessToken'])) {
            $this->personalAccessToken = $options['personalAccessToken'];
        } elseif (is_array($options) && !empty($options['accessToken'])) {
            $this->accessToken = $options['accessToken'];
        } else {
            throw new \Exception('You need to specify an API key or token');
        }

        // If the API key is not ended by ":", we append it.
        if (!empty($this->apiKey) && substr($this->apiKey, -1) !== ':') {
            $this->apiKey .= ':';
        }

        if (is_array($options) && !empty($options['returnType'])) {
            $this->setReturnType($options['returnType']);
        }

        $this->endPointUrl = 'https://app.asana.com/api/' . $this->asanaApiVersion . '/';
        $this->tasksUrl = $this->endPointUrl . 'tasks';
        $this->usersUrl = $this->endPointUrl . 'users';
        $this->projectsUrl = $this->endPointUrl . 'projects';
        $this->workspacesUrl = $this->endPointUrl . 'workspaces';
        $this->teamsUrl = $this->endPointUrl . 'teams';
        $this->storiesUrl = $this->endPointUrl . 'stories';
        $this->tagsUrl = $this->endPointUrl . 'tags';
        $this->organizationsUrl = $this->endPointUrl . 'organizations';
        $this->attachmentsUrl = $this->endPointUrl . 'attachments';
        $this->customFieldsUrl = $this->endPointUrl . 'custom_fields';
        $this->webhooksUrl = $this->endPointUrl . 'webhooks';
        $this->sectionsUrl = $this->endPointUrl . 'sections';
    }


    /**
     * **********************************
     * User functions
     * **********************************
     */

    /**
     * Returns the full user record for a single user.
     * Call it without parameters to get the users info of the owner of the API key.
     *
     * @param string $userId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getUserInfo($userId = null, array $opts = array())
    {
        $options = http_build_query($opts);

        if (is_null($userId)) {
            $userId = 'me';
        }

        return $this->askAsana($this->usersUrl . '/' . $userId . '?' . $options);
    }

    /**
     * Returns the user records for all users in all workspaces you have access.
     *
     * @param array $opts Array of options to pass to the API
     *                    (@see https://asana.com/developers/api-reference/users)
     *
     *                    Example: Returning additional fields with 'opt_fields'
     *                    getUsers(['opt_fields' => 'name,email,photo,workspaces'])
     *
     * @return string JSON or null
     */
    public function getUsers(array $opts = array())
    {
        return $this->askAsana($this->usersUrl . '?' . http_build_query($opts));
    }

    /**
     * Returns the user records for all users in a single workspace you have access.
     *
     * @param string $workspaceId
     *
     * @param array $opts Array of options to pass to the API
     *                    (@see https://asana.com/developers/api-reference/users)
     *
     *                    Example: Returning additional fields with 'opt_fields'
     *                    getUsersInWorkspace(0, ['opt_fields' => 'name,email,photo,workspaces'])
     *
     * @return string JSON or null
     */
    public function getUsersInWorkspace($workspaceId, array $opts = array())
    {
        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId . '/users/?' . http_build_query($opts));
    }


    /**
     * **********************************
     * Task functions
     * **********************************
     */

    /**
     * Creates a task.
     * For assign or remove the task to a project, use the addProjectToTask and removeProjectToTask.
     *
     * @param array $data Array of data for the task following the Asana API documentation.
     * Example:
     *
     * array(
     *     "workspace" => "1768",
     *     "name" => "Hello World!",
     *     "notes" => "This is a task for testing the Asana API :)",
     *     "assignee" => "176822166183",
     *     "followers" => array(
     *         "37136",
     *         "59083"
     *     )
     * )
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function createTask($data, array $opts = array())
    {
        $data = array('data' => $data);
        $data = json_encode($data);
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '?' . $options, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns task information
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTask($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '?' . $options);
    }

    /**
     * Creates a subtask in the parent task ID
     *
     * @param string $parentId The id of the parent task.
     * @param array $data Array of data for the task following the Asana API documentation.
     * Example:
     *
     * array(
     *     "name" => "Hello World!",
     *     "notes" => "This is a task for testing the Asana API :)",
     *     "assignee" => "176822166183",
     *     "followers" => array(
     *         "37136",
     *         "59083"
     *     )
     * )
     *
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function createSubTask($parentId, $data, array $opts = array())
    {
        $data = array('data' => $data);
        $data = json_encode($data);
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $parentId . '/subtasks?' . $options, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns sub-task information
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getSubTasks($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/subtasks?' . $options);
    }

    /**
     * Updated the parent from a task.
     *
     * @param string $taskId The task to update
     * @param string $parentId The id of the new parent task.
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function updateTaskParent($taskId, $parentId, array $opts = array())
    {
        $data = array('data' => array(
            'parent' => $parentId
        ));
        $data = json_encode($data);
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/setParent?' . $options, $data, ASANA_METHOD_POST);
    }

    /**
     * Updates a task
     *
     * @param string $taskId
     * @param array $data See, createTask function comments for proper parameter info.
     * @return string JSON or null
     */
    public function updateTask($taskId, $data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId, $data, ASANA_METHOD_PUT);
    }

    /**
     * Deletes a task.
     *
     * @param string $taskId
     * @return string Empty if success
     */
    public function deleteTask($taskId)
    {
        return $this->askAsana($this->tasksUrl . '/' . $taskId, null, ASANA_METHOD_DELETE);
    }

    /**
     * Moves a task within a project relative to another task.  This should let you take a task and move it below or
     * above another task as long as they are within the same project.
     *
     * @param string $projectId the project $taskReference is in and optionally $taskToMove is already in ($taskToMove will be
     *  added to the project if it's not already there)
     * @param string $taskToMove the task that will be moved (and possibly added to $projectId
     * @param string $taskReference the task that indicates a position for $taskToMove
     * @param bool $insertAfter true to insert after $taskReference, false to insert before
     * @return string JSON or null
     */
    public function moveTaskWithinProject($projectId, $taskToMove, $taskReference, $insertAfter = true)
    {
        $data = array('data' => array('project' => $projectId));
        if ($insertAfter) {
            $data['data']['insert_after'] = $taskReference;
        } else {
            $data['data']['insert_before'] = $taskReference;
        }
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskToMove . '/addProject', $data, ASANA_METHOD_POST);
    }

    /**
     * Returns the projects associated to the task.
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectsForTask($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/projects?' . $options);
    }

    /**
     * Adds a project to task. If successful, will return success and an empty data block.
     *
     * @param string $taskId
     * @param string $projectId
     * @param array $opts Array of options to pass (insert_after, insert_before, section)
     *                   (@see https://asana.com/developers/api-reference/tasks#projects)
     * @return string JSON or null
     */
    public function addProjectToTask($taskId, $projectId, array $opts = array())
    {
        $data = array('data' => array_merge($opts, array('project' => $projectId)));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/addProject', $data, ASANA_METHOD_POST);
    }

    /**
     * Removes project from task. If successful, will return success and an empty data block.
     *
     * @param string $taskId
     * @param string $projectId
     * @return string JSON or null
     */
    public function removeProjectFromTask($taskId, $projectId)
    {
        $data = array('data' => array('project' => $projectId));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/removeProject', $data, ASANA_METHOD_POST);
    }

    /**
     * Deprecated function, please use removeProjectFromTask
     */
    public function removeProjectToTask($taskId, $projectId) {
        trigger_error('Function is deprecated, please use removeProjectFromTask', E_USER_NOTICE);

        return $this->removeProjectFromTask($taskId, $projectId);
    }

    /**
     * Returns task by a given filter.
     * For now (limited by Asana API), you may limit your query either to a specific project or to an assignee and workspace
     *
     * NOTE: As Asana API says, if you filter by assignee, you MUST specify a workspaceId and viceversa.
     *
     * @param array $filter The filter with optional values.
     *
     * array(
     *     'assignee' => '',
     *     'project' => 0,
     *     'workspace' => 0
     * )
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getTasksByFilter($filter = array('assignee' => '', 'project' => '', 'workspace' => ''), array $opts = array())
    {
        $url = '';
        $filter = array_merge(array('assignee' => '', 'project' => '', 'workspace' => ''), $filter);

        $url .= $filter['assignee'] !== '' ? '&assignee=' . $filter['assignee'] : '';
        $url .= $filter['project'] !== '' ? '&project=' . $filter['project'] : '';
        $url .= $filter['workspace'] !== '' ? '&workspace=' . $filter['workspace'] : '';

        $optional_filters = array(
            'completed',
            'completed_at',
            'completed_since',
            'modified_since',
            'tag',
            'section'
        );

        foreach ($optional_filters as $optfilter) {
            $url .= isset($filter[$optfilter]) ? '&' . $optfilter . '=' . $filter[$optfilter] : '';
        }

        if (count($opts) > 0) {
            $url .= '&' . http_build_query($opts);
        }
        if (strlen($url) > 0) {
            $url = '?' . substr($url, 1);
        }

        return $this->askAsana($this->tasksUrl . $url);
    }

    /**
     * Returns the list of stories associated with the object.
     * As usual with queries, stories are returned in compact form.
     * However, the compact form for stories contains more information by default than just the ID.
     * There is presently no way to get a filtered set of stories.
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTaskStories($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/stories?' . $options);
    }

    /**
     * Returns a compact list of tags associated with the object.
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTaskTags($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/tags?' . $options);
    }

    /**
     * Adds a comment to a task.
     * The comment will be authored by the authorized user, and timestamped when the server receives the request.
     *
     * @param string $taskId
     * @param string $text
     * @return string JSON or null
     */
    public function commentOnTask($taskId, $text = '')
    {
        $data = array(
            'data' => array(
                'text' => $text
            )
        );
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/stories', $data, ASANA_METHOD_POST);
    }

    /**
     * Adds a tag to a task. If successful, will return success and an empty data block.
     *
     * @param string $taskId
     * @param string $tagId
     * @return string JSON or null
     */
    public function addTagToTask($taskId, $tagId)
    {
        $data = array('data' => array('tag' => $tagId));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/addTag', $data, ASANA_METHOD_POST);
    }

    /**
     * Removes a tag from a task. If successful, will return success and an empty data block.
     *
     * @param string $taskId
     * @param string $tagId
     * @return string JSON or null
     */
    public function removeTagFromTask($taskId, $tagId)
    {
        $data = array('data' => array('tag' => $tagId));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/removeTag', $data, ASANA_METHOD_POST);
    }

    /**
     * Returns single attachment information
     *
     * @param string $attachmentId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getAttachment($attachmentId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->attachmentsUrl . '/' . $attachmentId . '?' . $options);
    }

    /**
     * Add attachment to a task
     *
     * @param string $taskId
     * @param array $data (src of file, mimetype, finalFilename) See, Uploading an attachment to a task function comments for proper parameter info.
     * @return string JSON or null
     */
    public function addAttachmentToTask($taskId, array $data = array())
    {
        $mimeType = array_key_exists('mimeType', $data) ? $data['mimeType'] : null;
        $finalFilename = array_key_exists('finalFilename', $data) ? $data["finalFilename"] : null;

        if (class_exists('CURLFile', false)) {
            $data['file'] = new CURLFile($data['file'], $data['mimeType'], $data['finalFilename']);
        } else {
            $data['file'] = "@{$data['file']}";

            if (!is_null($finalFilename)) {
                $data['file'] .= ';filename=' . $finalFilename;
            }
            if (!is_null($mimeType)) {
                $data['file'] .= ';type=' . $mimeType;
            }
        }

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/attachments', $data, ASANA_METHOD_POST);
    }

    /**
     * Returns task attachments information
     *
     * @param string $taskId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTaskAttachments($taskId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/attachments?' . $options);
    }

    /**
     * Adds followers to a task
     *
     * @param string $taskId
     * @param array $followerIds Array of follower ids
     * @return string JSON or null
     */
    public function addFollowersToTask($taskId, array $followerIds)
    {
        $data = array('data' => array('followers' => $followerIds));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/addFollowers', $data, ASANA_METHOD_POST);
    }

    /**
     * Removes followers from a task
     *
     * @param string $taskId
     * @param array $followerIds Array of follower ids
     * @return string JSON or null
     */
    public function removeFollowersFromTask($taskId, array $followerIds)
    {
        $data = array('data' => array('followers' => $followerIds));
        $data = json_encode($data);

        return $this->askAsana($this->tasksUrl . '/' . $taskId . '/removeFollowers', $data, ASANA_METHOD_POST);
    }

    /**
     * **********************************
     * Projects functions
     * **********************************
     */

    /**
     * Function to create a project.
     *
     * @param array $data Array of data for the project following the Asana API documentation.
     * Example:
     *
     * array(
     *     "workspace" => "1768",
     *     "name" => "Foo Project!",
     *     "notes" => "This is a test project"
     * )
     *
     * @return string JSON or null
     */
    public function createProject($data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->projectsUrl, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns the full record for a single project.
     *
     * @param string $projectId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProject($projectId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '?' . $options);
    }

    /**
     * Returns the projects in all workspaces containing archived ones or not.
     *
     * @param boolean $archived Return archived projects or not
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     */
    public function getProjects($archived = false, $opts = array())
    {
        $archived = $archived ? 'true' : 'false';
        // Check if it's string for past compatibility (until version 4.3.0 it was a string instead of array)
        if (is_string($opts)) {
            $options = $opts !== '' ? 'opt_fields=' . $opts : '';
        } else {
            $options = http_build_query($opts);
        }

        return $this->askAsana($this->projectsUrl . '?archived=' . $archived . '&' . $options);
    }

    /**
     * Returns the projects in provided workspace containing archived ones or not.
     *
     * @param string $workspaceId
     * @param boolean $archived Return archived projects or not
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectsInWorkspace($workspaceId, $archived = false, array $opts = array())
    {
        $archived = $archived ? 'true' : 'false';
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '?archived=' . $archived . '&workspace=' . $workspaceId . '&' . $options);
    }

    /**
     * Returns the projects in provided workspace containing archived ones or not.
     *
     * @param string $teamId
     * @param boolean $archived Return archived projects or not
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectsInTeam($teamId, $archived = false, array $opts = array())
    {
        $archived = $archived ? 'true' : 'false';
        $options = http_build_query($opts);

        return $this->askAsana($this->teamsUrl . '/' . $teamId . '/projects?archived=' . $archived . '&' . $options);
    }

    /**
     * This method modifies the fields of a project provided in the request, then returns the full updated record.
     *
     * @param string $projectId
     * @param array $data An array containing fields to update, see Asana API if needed.
     * Example: array('name' => 'Test', 'notes' => 'It\'s a test project');
     *
     * @return string JSON or null
     */
    public function updateProject($projectId, $data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->projectsUrl . '/' . $projectId, $data, ASANA_METHOD_PUT);
    }

    /**
     * Deletes a project.
     *
     * @param string $projectId
     * @return string Empty if success
     */
    public function deleteProject($projectId)
    {
        return $this->askAsana($this->projectsUrl . '/' . $projectId, null, ASANA_METHOD_DELETE);
    }

    /**
     * Returns all unarchived tasks of a given project
     *
     * @param string $projectId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getProjectTasks($projectId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '?project=' . $projectId . '&' . $options);
    }

    /**
     * Returns the list of stories associated with the project.
     * As usual with queries, stories are returned in compact form.
     * However, the compact form for stories contains more
     * information by default than just the ID.
     * There is presently no way to get a filtered set of stories.
     *
     * @param string $projectId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectStories($projectId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/stories?' . $options);
    }

    /**
     * Returns the list of sections associated with the project.
     * Sections are tasks whose names end with a colon character : .
     * For instance sections will be included in query results for tasks and
     * be represented with the same fields.
     * The memberships property of a task contains the project/section
     * pairs a task belongs to when applicable.
     *
     * @param string $projectId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectSections($projectId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/sections?' . $options);
    }

    /**
     * Returns the list of all custom fields associated with the project.
     *
     * @param string $projectId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getProjectCustomFields($projectId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/custom_field_settings?' . $options);
    }

    /**
     * Adds a comment to a project
     * The comment will be authored by the authorized user, and timestamped when the server receives the request.
     *
     * @param string $projectId
     * @param string $text
     * @return string JSON or null
     */
    public function commentOnProject($projectId, $text = '')
    {
        $data = array(
            'data' => array(
                'text' => $text
            )
        );
        $data = json_encode($data);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/stories', $data, ASANA_METHOD_POST);
    }


    /**
     * **********************************
     * Tags functions
     * **********************************
     */

    /**
     * Returns the full record for a single tag.
     *
     * @param string $tagId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTag($tagId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tagsUrl . '/' . $tagId . '?' . $options);
    }

    /**
     * Returns the full record for all tags in all workspaces.
     *
     * @return string JSON or null
     */
    public function getTags()
    {
        return $this->askAsana($this->tagsUrl);
    }

    /**
     * Modifies the fields of a tag provided in the request, then returns the full updated record.
     *
     * @param string $tagId
     * @param array $data An array containing fields to update, see Asana API if needed.
     * Example: array("name" => "Test", "notes" => "It's a test tag");
     *
     * @return string JSON or null
     */
    public function updateTag($tagId, $data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->tagsUrl . '/' . $tagId, $data, ASANA_METHOD_PUT);
    }

    /**
     * This method creates a new tag and returns its full record.
     *
     * @param string $name Tag name
     * @param array $data An array containing either workspace or organization and the id.
     * Example: array("workspace" => "3242349871");
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function createTag($name, $data, array $opts = array())
    {
        $data = array('data' => $data);
        $data['data']['name'] = $name;
        $data = json_encode($data);
        $options = http_build_query($opts);

        return $this->askAsana($this->tagsUrl . '?' . $options, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns the list of all tasks with this tag. Tasks can have more than one tag at a time.
     *
     * @param string $tagId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getTasksWithTag($tagId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tagsUrl . '/' . $tagId . '/tasks?' . $options);
    }


    /**
     * **********************************
     * Stories and comments functions
     * **********************************
     */

    /**
     * Returns the full record for a single story.
     *
     * @param string $storyId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getSingleStory($storyId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->storiesUrl . '/' . $storyId . '?' . $options);
    }


    /**
     * **********************************
     * Organizations functions
     * **********************************
     */

    /**
     * Returns all teams in an Organization.
     *
     * @param string $organizationId
     * @return string JSON or null
     */
    public function getTeamsInOrganization($organizationId)
    {
        return $this->askAsana($this->organizationsUrl . '/' . $organizationId . '/teams');
    }

    /**
     * Returns all teams the logged in user is associated with
     *
     * @param string $organizationId
     * @return string JSON or null
     */
    public function getMyTeams($organizationId)
    {
        return $this->askAsana($this->usersUrl . '/me/teams?organization=' . $organizationId);
    }

    /**
     * Function to create a team in an Organization.
     *
     * @param string $organizationId
     * @param array $data Array of data for the task following the Asana API documentation.
     * Example: array("name" => "Team Name")
     *
     * @return string JSON or null
     */
    public function createTeam($organizationId, $data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->organizationsUrl . '/' . $organizationId . '/teams', $data, ASANA_METHOD_POST);
    }


    /**
     * **********************************
     * Workspaces functions
     * **********************************
     */

    /**
     * Returns all the workspaces.
     *
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getWorkspaces(array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->workspacesUrl . '?' . $options);
    }

    /**
     * Currently the only field that can be modified for a workspace is its name (as Asana API says).
     * This method returns the complete updated workspace record.
     *
     * @param array $data
     * Example: array("name" => "Test");
     *
     * @return string JSON or null
     */
    public function updateWorkspace($workspaceId, $data = array('name' => ''))
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId, $data, ASANA_METHOD_PUT);
    }

    /**
     * Returns tasks of all workspace assigned to someone.
     * Note: As Asana API says, you must specify an assignee when querying for workspace tasks.
     *
     * @param string $workspaceId The id of the workspace
     * @param string $assignee Can be "me" or user ID
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getWorkspaceTasks($workspaceId, $assignee = 'me', array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->tasksUrl . '?workspace=' . $workspaceId . '&assignee=' . $assignee . '&' . $options);
    }

    /**
     * Returns tags of all workspace.
     *
     * @param string $workspaceId The id of the workspace
     * @return string JSON or null
     */
    public function getWorkspaceTags($workspaceId)
    {
        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId . '/tags');
    }

    /**
     * Returns all users of a workspace.
     *
     * @param string $workspaceId The id of the workspace
     * @return string JSON or null
     */
    public function getWorkspaceUsers($workspaceId)
    {
        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId . '/users');
    }

    /**
     * Returns all custom fields in a workspace.
     * NOTE: Custom fields are only available for Asana premium accounts.
     *
     * @param string $workspaceId The id of the workspace
     * @return string JSON or null
     */
    public function getWorkspaceCustomFields($workspaceId)
    {
        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId . '/custom_fields');
    }

    /**
     * Returns search for objects from a single workspace.
     *
     * @param string $workspaceId The id of the workspace
     * @param string $type The type of object to look up. You can choose from one of the following: project, user, task, and tag.
     *                     Note that unlike other endpoints, the types listed here are in singular form.
     *                     Using multiple types is not yet supported.
     * @param string $query The value to look up
     * @param string $count The number of results to return with a minimum of 1 and a maximum of 100.
     *                      The default is 1 if this parameter is omitted.
     *                      If there are fewer results found than requested, all will be returned
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getWorkspaceTypeahead($workspaceId, $type, $query, $count = 1, array $opts = array())
    {
        $opts = array_merge($opts, array(
            'type' => $type,
            'query' => $query,
            'count' => $count
        ));
        $options = http_build_query($opts);

        return $this->askAsana($this->workspacesUrl . '/' . $workspaceId . '/typeahead?' . $options);
    }


    /**
     * **********************************
     * Section functions
     * **********************************
     */

    /**
     * Creates a section associated with a project.
     * More about sections (@see https://asana.com/developers/api-reference/sections)
     *
     * @param string $projectId
     * @param array $data Array of data for the task following the Asana API documentation.
     * Example:
     *
     * array(
     *     "workspace" => "1768",
     *     "name" => "Hello World!",
     *     "notes" => "This is a section for testing the Asana API :)",
     *     "assignee" => "176822166183",
     *     "followers" => array(
     *         "37136",
     *         "59083"
     *     )
     * )
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function createSection($projectId, $data, array $opts = array())
    {
        $data = array('data' => $data);
        $data = json_encode($data);
        $options = http_build_query($opts);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/sections?' . $options, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns the full record for a single section.
     *
     * @param string $sectionId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getSection($sectionId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->sectionsUrl . '/' . $sectionId . '?' . $options);
    }

    /**
     * This method modifies the fields of a section provided in the request, then returns the full updated record.
     *
     * @param string $sectionId
     * @param array $data An array containing fields to update, see Asana API if needed.
     * Example: array('name' => 'Test');
     *
     * @return string JSON or null
     */
    public function updateSection($sectionId, $data)
    {
        $data = array('data' => $data);
        $data = json_encode($data);

        return $this->askAsana($this->sectionsUrl . '/' . $sectionId, $data, ASANA_METHOD_PUT);
    }

    /**
     * Deletes a section.
     *
     * @param string $sectionId
     * @return string Empty if success
     */
    public function deleteSection($sectionId)
    {
        return $this->askAsana($this->sectionsUrl . '/' . $sectionId, null, ASANA_METHOD_DELETE);
    }


    /**
     * **********************************
     * Custom Fields functions
     * **********************************
     */

    /**
     * Returns custom field information
     *
     * @param string $customFieldId
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     * @return string JSON or null
     */
    public function getCustomField($customFieldId, array $opts = array())
    {
        $options = http_build_query($opts);

        return $this->askAsana($this->customFieldsUrl . '/' . $customFieldId . '?' . $options);
    }

    /**
     * Adds a custom field to a project. If successful, will return success and an empty data block.
     *
     * @param string $projectId The project to associate the custom field with
     * @param string $customFieldId The id of the custom field to associate with this project.
     * @param boolean $isImportant Whether this field should be considered important to this project.
     * @param string $insertBefore An id of a Custom Field Settings on this project, before which the new Custom Field Settings will be added.
     *                             insert_before and insert_after parameters cannot both be specified.
     * @param string $insertAfter An id of a Custom Field Settings on this project, after which the new Custom Field Settings will be added.
     *                            insert_before and insert_after parameters cannot both be specified.
     * @return string JSON or null
     */
    public function addCustomFieldToProject($projectId, $customFieldId, $isImportant, $insertBefore = null, $insertAfter = null)
    {
        $data = array(
            'custom_field' => $customFieldId,
            'is_important' => is_bool($isImportant) ? var_export($isImportant, true) : $isImportant
        );
        if (!is_null($insertBefore)) {
            $data['insert_before'] = $insertBefore;
        } elseif (!is_null($insertAfter)) {
            $data['insert_after'] = $insertAfter;
        }
        $data = json_encode(array('data' => $data));

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/addCustomFieldSetting', $data, ASANA_METHOD_POST);
    }

    /**
     * Removes a custom field from a project. If successful, will return success and an empty data block.
     *
     * @param string $projectId The project from where to remove the custom field
     * @param string $customFieldId The id of the custom field to remove from the project
     * @return string JSON or null
     */
    public function removeCustomFieldFromProject($projectId, $customFieldId)
    {
        $data = array('data' => array(
            'custom_field' => $customFieldId
        ));
        $data = json_encode($data);

        return $this->askAsana($this->projectsUrl . '/' . $projectId . '/removeCustomFieldSetting', $data, ASANA_METHOD_POST);
    }


    /**
     * **********************************
     * Webhooks functions
     * **********************************
     */

    /**
     * Creates a webhook.
     * Please read the documentation (or see webhook-target.php inside examples) as the target must be a valid url and must return a valid header back.
     * https://asana.com/developers/api-reference/webhooks
     *
     * @param string $resourceId A resource ID to subscribe to. The resource can be a task or project.
     * @param string $target The URL to receive the HTTP POST.
     * @return string JSON or null
     */
    public function createWebhook($resourceId, $target)
    {
        $data = array('data' => array(
            'resource' => $resourceId,
            'target' => $target
        ));
        $data = json_encode($data);

        return $this->askAsana($this->webhooksUrl, $data, ASANA_METHOD_POST);
    }

    /**
     * Returns the compact representation of all webhooks your app has registered for the authenticated user in the given workspace.
     *
     * @param string $workspaceId The workspace to query for webhooks in.
     * @param string $resource Optional: Only return webhooks for the given resource.
     * @param array $opts Array of options to pass
     *                   (@see https://asana.com/developers/documentation/getting-started/input-output-options)
     *
     * @return string JSON or null
     */
    public function getWebhooks($workspaceId, $resource = null, array $opts = array())
    {
        $opts = array_merge($opts, array(
            'workspace' => $workspaceId
        ));
        if (!is_null($resource)) {
            $opts['resource'] = $resource;
        }
        $options = http_build_query($opts);

        return $this->askAsana($this->webhooksUrl . '?' . $options);
    }

    /**
     * Returns the full record for the given webhook.
     *
     * @param string $webhookId The webhook to get.
     * @return string JSON or null
     */
    public function getWebhook($webhookId)
    {
        return $this->askAsana($this->webhooksUrl . '/' . $webhookId);
    }

    /**
     * This method permanently removes a webhook.
     *
     * @param string $webhookId The webhook to delete.
     * @return string JSON or null
     */
    public function deleteWebhook($webhookId)
    {
        return $this->askAsana($this->webhooksUrl . '/' . $webhookId, null, ASANA_METHOD_DELETE);
    }

    /**
     * This function communicates with Asana REST API.
     * You don't need to call this function directly. It's only for inner class working.
     *
     * @param string $url
     * @param string $data Must be a json string
     * @param int $method See constants defined at the beginning of the class
     * @return string JSON or null
     */
    private function askAsana($url, $data = null, $method = ASANA_METHOD_GET)
    {
        $headerData = array();
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true); // Don't print the result
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $this->timeout);
        curl_setopt($curl, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($curl, CURLOPT_FAILONERROR, $this->failOnError);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true); // Verify SSL connection
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); //         ""           ""

        if (!empty($this->apiKey)) {
            // Send with API key.
            curl_setopt($curl, CURLOPT_USERPWD, $this->apiKey);
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

            // Don't send as json when attaching files to tasks.
            if (is_string($data) || empty($data['file'])) {
                array_push($headerData, 'Content-Type: application/json'); // Send as JSON
            }
        } elseif (!empty($this->accessToken) || !empty($this->personalAccessToken)) {
            if (!empty($this->accessToken)) {
                $accessToken = $this->accessToken;
            } else {
                $accessToken = $this->personalAccessToken;
            }

            // Send with auth token.
            array_push($headerData, 'Authorization: Bearer ' . $accessToken);

            // Don't send as json when attaching files to tasks.
            if (is_string($data) || empty($data['file'])) {
                array_push($headerData, 'Content-Type: application/json');
            }
        }

        if ($this->advDebug) {
            curl_setopt($curl, CURLOPT_HEADER, true); // Display headers
            curl_setopt($curl, CURLINFO_HEADER_OUT, true); // Display output headers
            curl_setopt($curl, CURLOPT_VERBOSE, true); // Display communication with server
        }

        if ($method == ASANA_METHOD_POST) {
            curl_setopt($curl, CURLOPT_POST, true);
        } elseif ($method == ASANA_METHOD_PUT) {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
        } elseif ($method == ASANA_METHOD_DELETE) {
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }
        if (!is_null($data) && ($method == ASANA_METHOD_POST || $method == ASANA_METHOD_PUT)) {
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }

        if ($this->fastAPI) {
            array_push($headerData, 'Asana-Fast-Api: true');
        }

        if ($this->newRichText) {
            array_push($headerData, 'Asana-Enable: new_rich_text');
        } else {
            array_push($headerData, 'Asana-Disable: new_rich_text');
        }

        if (sizeof($headerData) > 0) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headerData);
        }

        try {
            $this->response = curl_exec($curl);
            $this->responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            if ($this->debug || $this->advDebug) {
                $info = curl_getinfo($curl);
                echo '<pre>';
                print_r($info);
                echo '</pre>';
                if ($info['http_code'] == 0) {
                    echo '<br>cURL error num: ' . curl_errno($curl);
                    echo '<br>cURL error: ' . curl_error($curl);
                }
                echo '<br>Sent info:<br><pre>';
                print_r($data);
                echo '</pre>';
            }
        } catch (Exception $ex) {
            if ($this->debug || $this->advDebug) {
                echo '<br>cURL error num: ' . curl_errno($curl);
                echo '<br>cURL error: ' . curl_error($curl);
            }
            echo 'Error on cURL';
            $this->response = null;
        }

        curl_close($curl);

        return $this->response;
    }

    /**
     * Set the return type.
     *
     * @param int $type Return type defined in the constants.
     * @return Asana
     */
    public function setReturnType($type)
    {
        $this->returnType = $type;

        return $this;
    }

    /**
     * Checks for errors in the response.
     *
     * @return boolean
     */
    public function hasError()
    {
        return !in_array($this->responseCode, array(200, 201)) || is_null($this->response);
    }

    /**
     * Decodes the response and returns as an object, array.
     *
     * @return object, array, or null
     */
    public function getErrors()
    {
        $array = $this->returnType == ASANA_RETURN_TYPE_ARRAY;
        $return = json_decode($this->response, $array, 512, JSON_BIGINT_AS_STRING);

        if ($array && isset($return['errors'])) {
            return $return['errors'];
        } elseif ($this->returnType == ASANA_RETURN_TYPE_OBJECT && isset($return->errors)){
            return $return->errors;
        } elseif ($this->returnType == ASANA_RETURN_TYPE_JSON){
            return $this->response;
        }
    }

    /**
     * Decodes the response and returns as an object, array.
     *
     * @return object, array, string or null
     */
    public function getData()
    {
        if (!$this->hasError()) {
            $array = $this->returnType == ASANA_RETURN_TYPE_ARRAY;
            $return = json_decode($this->response, $array, 512, JSON_BIGINT_AS_STRING);

            if ($array && isset($return['data'])) {
                return $return['data'];
            } elseif ($this->returnType == ASANA_RETURN_TYPE_OBJECT && isset($return->data)){
                return $return->data;
            } elseif ($this->returnType == ASANA_RETURN_TYPE_JSON){
                return $this->response;
            }
        }

        return null;
    }

    public function getAsana($query){
        $url = 'https://app.asana.com/api/1.0/'.$query;
        $data = $this->askAsana($url);
        return json_decode($data);
    }
}
