# WP Project Manager API Tests

Comprehensive API test suite for the WordPress Project Manager plugin.

## Test Structure

All test files extend `PM_API_Test_Case` which provides:
- Pre-configured REST server
- Admin, editor, and subscriber test users
- Automatic setup and teardown

## Test Files

### 1. test-projects.php
Tests for project management endpoints:
- ✓ Get all projects
- ✓ Get single project
- ✓ Create project
- ✓ Update project
- ✓ Delete project
- ✓ Favourite project
- ✓ Advanced project listing with filters
- ✓ Project search
- ✓ AI project generation
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects`
- `GET /pm/v2/advanced/projects`
- `GET /pm/v2/projects/{id}`
- `POST /pm/v2/projects`
- `POST /pm/v2/projects/{id}/update`
- `POST /pm/v2/projects/{id}/delete`
- `POST /pm/v2/projects/{id}/favourite`
- `POST /pm/v2/projects/ai/generate`

### 2. test-tasks.php
Tests for task management:
- ✓ Get all tasks
- ✓ Get single task
- ✓ Create task
- ✓ Update task
- ✓ Delete task
- ✓ Change task status
- ✓ Assign/unassign users
- ✓ Task sorting
- ✓ Filter tasks
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/tasks`
- `GET /pm/v2/projects/{project_id}/tasks/{task_id}`
- `POST /pm/v2/projects/{project_id}/tasks`
- `POST /pm/v2/projects/{project_id}/tasks/{task_id}/update`
- `POST /pm/v2/projects/{project_id}/tasks/{task_id}/delete`
- `PUT /pm/v2/projects/{project_id}/tasks/{task_id}/attach-users`
- `PUT /pm/v2/projects/{project_id}/tasks/{task_id}/detach-users`

### 3. test-task-lists.php
Tests for task list management:
- ✓ Get all task lists
- ✓ Get single task list
- ✓ Create task list
- ✓ Update task list
- ✓ Delete task list
- ✓ Task list sorting
- ✓ Search task lists
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/task-lists`
- `GET /pm/v2/projects/{project_id}/task-lists/{task_list_id}`
- `POST /pm/v2/projects/{project_id}/task-lists`
- `POST /pm/v2/projects/{project_id}/task-lists/{task_list_id}/update`
- `POST /pm/v2/projects/{project_id}/task-lists/{task_list_id}/delete`
- `POST /pm/v2/projects/{project_id}/lists/sorting`

### 4. test-comments.php
Tests for comment management:
- ✓ Get all comments
- ✓ Get single comment
- ✓ Create comment
- ✓ Update comment
- ✓ Delete comment
- ✓ Validation (empty content)
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/comments`
- `GET /pm/v2/projects/{project_id}/comments/{comment_id}`
- `POST /pm/v2/projects/{project_id}/comments`
- `POST /pm/v2/projects/{project_id}/comments/{comment_id}`
- `POST /pm/v2/projects/{project_id}/comments/{comment_id}/delete`

### 5. test-milestones.php
Tests for milestone management:
- ✓ Get all milestones
- ✓ Get single milestone
- ✓ Create milestone
- ✓ Update milestone
- ✓ Delete milestone
- ✓ Set milestone privacy
- ✓ Validation
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/milestones`
- `GET /pm/v2/projects/{project_id}/milestones/{milestone_id}`
- `POST /pm/v2/projects/{project_id}/milestones`
- `POST /pm/v2/projects/{project_id}/milestones/{milestone_id}/update`
- `POST /pm/v2/projects/{project_id}/milestones/{milestone_id}/delete`
- `POST /pm/v2/projects/{project_id}/milestones/privacy/{milestone_id}`

### 6. test-activities.php
Tests for activity tracking:
- ✓ Get all activities
- ✓ Activities with pagination
- ✓ Filter by resource type
- ✓ Filter by resource ID
- ✓ Filter by action type
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/activities`
- `GET /pm/v2/activities`

### 7. test-files.php
Tests for file management:
- ✓ Get all files
- ✓ Get single file
- ✓ Upload file
- ✓ Rename file
- ✓ Delete file
- ✓ Get MIME type icon
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/files`
- `GET /pm/v2/projects/{project_id}/files/{file_id}`
- `POST /pm/v2/projects/{project_id}/files`
- `POST /pm/v2/projects/{project_id}/files/{file_id}/update`
- `POST /pm/v2/projects/{project_id}/files/{file_id}/delete`
- `GET /pm/v2/get-mime-type-icon`

### 8. test-users.php
Tests for user management:
- ✓ Get project users
- ✓ Add users to project
- ✓ Remove user from project
- ✓ Update user role
- ✓ Get user profile
- ✓ Get current user
- ✓ Search users
- ✓ Filter users by role
- ✓ Permission validation

**Endpoints Covered:**
- `GET /pm/v2/projects/{project_id}/users`
- `POST /pm/v2/projects/{project_id}/users`
- `POST /pm/v2/projects/{project_id}/users/{user_id}/delete`
- `POST /pm/v2/projects/{project_id}/users/{user_id}/update-role`
- `GET /pm/v2/users/{user_id}`
- `GET /pm/v2/users/me`
- `GET /pm/v2/users/search`

## Running Tests

### Prerequisites
```bash
# Install WordPress test library
bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
```

### Run All Tests
```bash
# From plugin root directory
vendor/bin/phpunit

# Or with configuration
vendor/bin/phpunit -c phpunit.xml
```

### Run Specific Test Suite
```bash
# Run only API tests
vendor/bin/phpunit tests/api/

# Run specific test file
vendor/bin/phpunit tests/api/test-projects.php

# Run specific test method
vendor/bin/phpunit --filter test_create_project tests/api/test-projects.php
```

### With Coverage
```bash
vendor/bin/phpunit --coverage-html coverage/
```

## Test Database

Tests use a separate WordPress test database. Configure in `phpunit.xml`:
```xml
<env name="WP_TESTS_DB_NAME" value="wp_test"/>
<env name="WP_TESTS_DB_USER" value="root"/>
<env name="WP_TESTS_DB_PASSWORD" value=""/>
<env name="WP_TESTS_DB_HOST" value="localhost"/>
```

## Common Test Patterns

### Testing Successful Response
```php
$request = new WP_REST_Request('GET', '/pm/v2/projects');
$response = $this->server->dispatch($request);

$this->assertEquals(200, $response->get_status());
$data = $response->get_data();
$this->assertArrayHasKey('data', $data);
```

### Testing Validation Errors
```php
$request = new WP_REST_Request('POST', '/pm/v2/projects');
$request->set_body_params([
    'description' => 'No title provided'
]);

$response = $this->server->dispatch($request);
$this->assertNotEquals(201, $response->get_status());
```

### Testing Permissions
```php
wp_set_current_user($this->subscriber_user);

$request = new WP_REST_Request('POST', '/pm/v2/projects');
$response = $this->server->dispatch($request);

$this->assertNotEquals(201, $response->get_status());
```

## Test Coverage

Current test coverage includes:
- ✅ All major CRUD operations
- ✅ User permission validation
- ✅ Input validation
- ✅ Error handling
- ✅ Authentication/Authorization
- ✅ Relationship operations (assign/detach users)
- ✅ Search and filtering
- ✅ Sorting operations

## Contributing

When adding new API endpoints:
1. Create test methods in appropriate test file
2. Test all HTTP methods (GET, POST, PUT, DELETE)
3. Test success and error cases
4. Test with different user roles
5. Validate response structure
6. Clean up test data in tearDown()

## Notes

- Tests run in isolation with automatic database cleanup
- Each test has access to admin, editor, and subscriber users
- REST server is initialized before each test
- Test data is cleaned up automatically in tearDown() methods
