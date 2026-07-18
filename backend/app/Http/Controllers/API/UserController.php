<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);
        $user->update($validated);
        return response()->json($user);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    /**
     * Suppression de compte (droit a l'effacement, RGPD art. 17).
     *
     * On anonymise plutot que de supprimer physiquement la ligne : la table
     * bookings a une contrainte cascadeOnDelete() sur id_user, donc un vrai
     * DELETE effacerait silencieusement tout l'historique de reservations
     * (perte de donnees, incoherence des sieges reserves sur les seances
     * passees). L'anonymisation supprime toute donnee identifiante (nom,
     * email, mot de passe) tout en preservant l'integrite des reservations.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe incorrect.'], 422);
        }

        // Revoque tous les tokens Sanctum (deconnexion de tous les appareils).
        $user->tokens()->delete();

        $user->update([
            'first_name' => 'Utilisateur',
            'last_name'  => 'Supprimé',
            'email'      => 'deleted_user_' . $user->id . '_' . Str::random(8) . '@anonymized.local',
            'password'   => Hash::make(Str::random(40)),
        ]);

        return response()->json([
            'message' => 'Votre compte a été supprimé.'
        ]);
    }
}
