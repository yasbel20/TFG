<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'avatar', 'categorias_favoritas', 'accesibilidad_preferida', 'onboarding_completado'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    // HasApiTokens → habilita la autenticación por token de Laravel Sanctum
    use HasApiTokens, HasFactory, Notifiable;

    // Relación N:M con Evento a través de la tabla pivote 'favoritos'
    public function eventosFavoritos()
    {
        return $this->belongsToMany(Evento::class, 'favoritos');
    }

    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'password'                => 'hashed',           // bcrypt automático al asignar
            'categorias_favoritas'    => 'array',            // JSON en BD ↔ array en PHP
            'accesibilidad_preferida' => 'array',            // JSON en BD ↔ array en PHP
            'onboarding_completado'   => 'boolean',
        ];
    }
}
