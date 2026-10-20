<?php

namespace WeDevs\PM\Comment\Transformers;

use WeDevs\PM\Comment\Models\Comment;
use League\Fractal\TransformerAbstract;
use WeDevs\PM\File\Transformers\File_Transformer;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\User\Transformers\User_Transformer;
use WeDevs\PM\Common\Traits\Resource_Editors;
use WeDevs\PM\Core\Router\WP_Router;

class Comment_Transformer extends TransformerAbstract {

    use Resource_Editors;

    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $availableIncludes = [
        'replies'
    ];

    protected $defaultIncludes = [
        'files', 'creator', 'updater'
    ];

    public function transform( Comment $item ) {
        return [
            'id'               => (int) $item->id,
            'content'          => apply_filters( 'wedevs_pm_comment_content_visibility', wedevs_pm_get_content( $item->content ), (int) $item->project_id ),
            'commentable_type' => $item->commentable_type,
            'commentable_id'   => $item->commentable_id,
            'created_at'       => wedevs_pm_format_date( $item->created_at ),
            'updated_at'       => wedevs_pm_format_date( $item->updated_at ),
            'project_id'       => (int) $item->project_id,
            'meta'       => [
                'total_replies' => $this->total_replies( $item ),
            ],

        ];
    }

        /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes()
    {
        return apply_filters( "wedevs_pm_comment_transformer_default_includes", $this->defaultIncludes );
    }

    /**
     * Reply count without a query when the replies are already loaded. Replies
     * are one level deep, so a reply never has replies of its own.
     *
     * @param Comment $item
     *
     * @return int
     */
    private function total_replies( Comment $item ) {
        if ( 'comment' === $item->commentable_type ) {
            return 0;
        }

        if ( $item->relationLoaded( 'replies' ) ) {
            return $item->replies->count();
        }

        return $item->replies()->count();
    }

    /**
     * Include replies to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeReplies( Comment $item ) {
        // Eager loaded by Comment::thread_relations(): no query per comment.
        if ( $item->relationLoaded( 'replies' ) ) {
            return $this->collection( $item->replies, new Comment_Transformer );
        }

        $request = WP_Router::$request;
        $page    = $request ? ( $request->get_param( 'reply_page' ) ?? 1 ) : 1;

        $replies = $item->replies()->orderBy( 'created_at', 'ASC' )->orderBy( 'id', 'ASC' )->paginate( wedevs_pm_config('app.comment_per_page'), ['*'], 'reply_page', $page );

        $reply_collection = $replies->getCollection();
        $resource = $this->collection( $reply_collection, new Comment_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $replies ) );

        return $resource;
    }

    /**
     * Include files to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFiles( Comment $item ) {
        $request = WP_Router::$request;
        $page    = $request ? ( $request->get_param( 'file_page' ) ?? 1 ) : 1;

        $files = $item->relationLoaded( 'files' ) ? $item->files : $item->files()->get();

        $resource = $this->collection( $files, new File_Transformer );

        return $resource;
    }
}
