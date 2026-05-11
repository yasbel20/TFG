<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recinto extends Model
{
    protected $fillable = ['nombre', 'direccion', 'distrito', 'municipio'];

    public function eventos()
    {
        return $this->hasMany(Evento::class);
    }
}
