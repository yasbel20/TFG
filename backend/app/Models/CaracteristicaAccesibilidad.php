<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaracteristicaAccesibilidad extends Model
{
    protected $table    = 'caracteristicas_accesibilidad';
    protected $fillable = ['evento_id', 'tipo'];

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
}
