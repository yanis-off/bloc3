<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Telescope (laravel/telescope) est une dependance "require-dev" :
        // en production, composer install --no-dev ne l'installe pas.
        // On ne l'enregistre donc que si la classe existe reellement,
        // pour ne jamais casser le build production.
        if (class_exists(\Laravel\Telescope\TelescopeApplicationServiceProvider::class)) {
            $this->app->register(\App\Providers\TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Les API Resources (app/Http/Resources) enveloppent par defaut leur
        // reponse dans une cle "data" ({"data": {...}}). Le frontend existant
        // consomme deja les reponses JSON brutes (tableau ou objet direct),
        // donc on desactive ce wrapping pour ne pas changer le format de
        // reponse en introduisant les Resources (corrige P1-09 sans casser
        // le frontend).
        JsonResource::withoutWrapping();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
