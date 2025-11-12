<?php

namespace WeDevs\PM\Settings\Models;

use WeDevs\PM\Core\DB_Connection\Model as Eloquent;
use WeDevs\PM\Common\Traits\Model_Events;

class Settings extends Eloquent {

    use Model_Events;

    protected $table = 'pm_settings';

    protected $fillable = [
        'key',
        'value',
        'project_id',
        'created_by',
        'updated_by'
    ];

    public static $hideSettings = [
        'zapier_api',
        'ai_api_key',
        'ai_api_key_openai',
        'ai_api_key_anthropic',
        'ai_api_key_google'
    ];

    public function setValueAttribute( $value ) {
        // Handle null and empty values
        if ( $value === null || $value === '' ) {
            $this->attributes['value'] = '';
            return;
        }
        
        // For arrays and objects, JSON encode them
        if ( is_array( $value ) || is_object( $value ) ) {
            $encoded = json_encode( $value, JSON_UNESCAPED_UNICODE );
            if ( $encoded === false ) {
                // Fallback: serialize if JSON encoding fails
                $this->attributes['value'] = serialize( $value );
            } else {
                $this->attributes['value'] = $encoded;
            }
            return;
        }
        
        // For scalar values (string, int, float, bool), check if it's already JSON
        if ( is_string( $value ) && $this->isJson( $value ) ) {
            // Already JSON encoded, store as-is
            $this->attributes['value'] = $value;
        } else {
            // Simple scalar value, JSON encode it (e.g., "openai" becomes "\"openai\"")
            $encoded = json_encode( $value, JSON_UNESCAPED_UNICODE );
            if ( $encoded === false ) {
                // Fallback: store as string
                $this->attributes['value'] = (string) $value;
            } else {
                $this->attributes['value'] = $encoded;
            }
        }
    }

    public function getValueAttribute( $value ) {
        // Handle empty values
        if ( $value === null || $value === '' ) {
            return $value;
        }
        
        // Try JSON decode first
        $decoded = json_decode( $value, true );
        if ( json_last_error() === JSON_ERROR_NONE ) {
            return $decoded;
        }
        
        // If JSON decode failed, try unserialize (for backward compatibility with old data)
        $unserialized = @unserialize( $value );
        if ( $unserialized !== false ) {
            return $unserialized;
        }
        
        // If neither works, return as string (for plain text values)
        return $value;
    }
    
    /**
     * Check if a string is valid JSON
     *
     * @param string $string
     * @return bool
     */
    private function isJson( $string ) {
        if ( ! is_string( $string ) ) {
            return false;
        }
        json_decode( $string );
        return json_last_error() === JSON_ERROR_NONE;
    }
}