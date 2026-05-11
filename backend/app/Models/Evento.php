<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $fillable = [
        'api_id', 'titulo', 'descripcion', 'categoria',
        'fecha_inicio', 'fecha_fin', 'precio', 'gratuito',
        'imagen_url', 'url_externo', 'recinto_id',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin'    => 'datetime',
        'gratuito'     => 'boolean',
    ];

    public function recinto()
    {
        return $this->belongsTo(Recinto::class);
    }

    public function accesibilidad()
    {
        return $this->hasMany(CaracteristicaAccesibilidad::class);
    }
}
