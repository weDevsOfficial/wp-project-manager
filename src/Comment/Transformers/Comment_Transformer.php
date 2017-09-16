<?php

namespace CPM\Comment\Transformers;

use CPM\Comment\Models\Comment;
use League\Fractal\TransformerAbstract;
use CPM\File\Transformer\File_Transformer;

class Comment_Transformer extends TransformerAbstract {
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $availableIncludes = [
        'replies', 'files'
    ];

    public function transform( Comment $item ) {
        return [
            'id'         => (int) $item->id,
            'content'    => $item->content,
            'created_by' => $item->created_by,
            'edit_mode'  => false,
        ];
    }

    /**
     * Include replies to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeReplies( Comment $item ) {
        $replies = $item->replies;

        return $this->collection( $replies, new Comment_Transformer );
    }

    /**
     * Include files to a comment
     *
     * @param Comment $item
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFiles( Comment $item ) {
        $files = $item->files;

        return $this->collection( $files, new File_Transformer );
    }
}