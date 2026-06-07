<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    protected $fillable = ['user_id', 'evento_id', 'evento_data'];

    protected function casts(): array
    {
        return ['evento_data' => 'array'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
