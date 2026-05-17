<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecomendacionesController extends Controller
{
    public function generar(Request $request)
    {
        $prompt = $request->input('messages')[0]['content'] ?? '';

        $response = Http::withoutVerifying()->post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=' . env('GEMINI_API_KEY'),
            [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]
        );

        $json = $response->json();

        if ($response->failed() || isset($json['error'])) {
            $msg = $json['error']['message'] ?? 'Error al contactar con la IA';
            return response()->json(['error' => $msg], 502);
        }

        $text = $json['candidates'][0]['content']['parts'][0]['text'] ?? '[]';

        return response()->json([
            'content' => [['text' => $text]]
        ]);
    }
}
