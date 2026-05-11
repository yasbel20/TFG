<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('api_id')->unique()->nullable();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('categoria');
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_fin')->nullable();
            $table->string('precio')->default('Gratis');
            $table->boolean('gratuito')->default(true);
            $table->string('imagen_url')->nullable();
            $table->string('url_externo')->nullable();
            $table->foreignId('recinto_id')->nullable()->constrained('recintos')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
