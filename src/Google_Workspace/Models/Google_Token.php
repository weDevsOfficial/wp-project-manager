<?php
namespace WeDevs\PM\Google_Workspace\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;

class Google_Token extends Eloquent {

    protected $table = 'pm_google_tokens';

    protected $fillable = [
        'user_id',
        'google_email',
        'access_token',
        'refresh_token',
        'scope',
        'expires_at',
        'last_used_at',
    ];
}
