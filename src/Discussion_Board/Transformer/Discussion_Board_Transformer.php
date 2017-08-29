<?php

namespace CPM\Discussion_Board\Transformer;

use CPM\Discussion_Board\Models\Discussion_Board;
use League\Fractal\TransformerAbstract;
use CPM\Common\Transformers\Boardable_User_Transformer;
use CPM\Comment\Transformers\Comment_Transformer;
use CPM\File\Transformer\File_Transformer;

class Discussion_Board_Transformer extends TransformerAbstract {
    protected $defaultIncludes = [
        'users'
    ];

    protected $availableIncludes = [
        'comments', 'files'
    ];

    public function transform( Discussion_Board $item ) {
        return [
            'id' => (int) $item->id,
            'title' => $item->title,
            'description' => $item->description,
            'order' => $item->order,
            'created_by' => $item->created_by,
            'updated_by' => $item->updated_by,
            'meta' => [
                'total_comments' => $item->comments->count(),
                'total_users' => $item->users->count(),
                'total_files' => $item->files->count(),
            ],
        ];
    }

    public function includeUsers( Discussion_Board $item ) {
        $users = $item->users;

        return $this->collection( $users, new Boardable_User_Transformer );
    }

    public function includeComments( Discussion_Board $item ) {
        $comments = $item->comments;

        return $this->collection( $comments, new Comment_Transformer );
    }

    public function includeFiles( Discussion_Board $item ) {
        $files = $item->files;

        return $this->collection( $files, new File_Transformer );
    }
}