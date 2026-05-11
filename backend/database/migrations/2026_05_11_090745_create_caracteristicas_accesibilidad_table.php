<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caracteristicas_accesibilidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos')->cascadeOnDelete();
            $table->string('tipo'); // silla | signos | podo | bucle
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caracteristicas_accesibilidad');
    }
};
