<?php namespace App\Http\Middleware;

use Closure;

class AdminMiddleware
{

    private $canManage = array(
        'country',
        'savecountry',
        'clinic',
        'product'
    );
    /**
     * Run the request filter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Get url route from lumen request
        $current_route = $request->route();

        if( isset($current_route[2]['name'])) {
            if(!in_array($current_route[2]['name'], $this->canManage)) {
                abort(404);
            }
        }

        return $next($request);
    }

}
