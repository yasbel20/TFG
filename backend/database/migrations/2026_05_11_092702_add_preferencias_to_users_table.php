<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('categorias_favoritas')->nullable()->after('favoritos');
            $table->json('accesibilidad_preferida')->nullable()->after('categorias_favoritas');
            $table->boolean('onboarding_completado')->default(false)->after('accesibilidad_preferida');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['categorias_favoritas', 'accesibilidad_preferida', 'onboarding_completado']);
        });
    }
};
