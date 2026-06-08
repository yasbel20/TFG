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

    // El recinto donde se celebra el evento (N:1) — si se borra el recinto, recinto_id queda NULL
    public function recinto()
    {
        return $this->belongsTo(Recinto::class);
    }

    // Características de accesibilidad del evento (1:N) — se eliminan en cascada con el evento
    public function accesibilidad()
    {
        return $this->hasMany(CaracteristicaAccesibilidad::class);
    }

    // Usuarios que han guardado este evento en favoritos (N:M inversa)
    public function usuariosFavoritos()
    {
        return $this->belongsToMany(User::class, 'favoritos');
    }
}
