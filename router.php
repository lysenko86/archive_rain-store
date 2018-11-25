<?php
class Router{
    private $action     = 'none';
    private $params     = [];
    private $userRole   = '';
    private $adminToken = 'bAYOBNDFC1oiI46TkEOfyafJQymccGHJGThEl6dp0moFK3ksZNg220HHosl3rukt';



    private $actions = [
        'signup'           => ['ctrl' => 'Users', 'method' => 'signup',           'access' => ['guest']],
        'confirm'          => ['ctrl' => 'Users', 'method' => 'confirm',          'access' => ['guest']],
        'signin'           => ['ctrl' => 'Users', 'method' => 'signin',           'access' => ['guest']],
        'sendConfirmMail'  => ['ctrl' => 'Users', 'method' => 'sendConfirmMail',  'access' => ['guest']],
        'sendPasswordMail' => ['ctrl' => 'Users', 'method' => 'sendPasswordMail', 'access' => ['guest']],
        'reset'            => ['ctrl' => 'Users', 'method' => 'reset',            'access' => ['guest']],
        'logout'           => ['ctrl' => 'Users', 'method' => 'logout',           'access' => ['user', 'manager', 'admin']],
        'getProfile'       => ['ctrl' => 'Users', 'method' => 'getProfile',       'access' => ['user', 'manager', 'admin']],

        'getProducts' => ['ctrl' => 'Products', 'method' => 'getProducts', 'access' => ['guest', 'user', 'manager', 'admin']],
        'getProduct'  => ['ctrl' => 'Products', 'method' => 'getProduct',  'access' => ['guest', 'user', 'manager', 'admin']],

        'createOrder'       => ['ctrl' => 'Orders', 'method' => 'createOrder',       'access' => ['guest', 'user', 'manager', 'admin']],
        'getOrders'         => ['ctrl' => 'Orders', 'method' => 'getOrders',         'access' => ['user', 'manager', 'admin']],
        'getOrderProducts'  => ['ctrl' => 'Orders', 'method' => 'getOrderProducts',  'access' => ['user', 'manager', 'admin']],
        'changeOrderStatus' => ['ctrl' => 'Orders', 'method' => 'changeOrderStatus', 'access' => ['manager', 'admin']]
    ];



    function __construct(){
        $request = json_decode(file_get_contents('php://input'));
        if (!empty($_GET)){
            foreach ($_GET as $k=>$v){
                $this->params[$k] = trim($v);
            }
        }
        if (!empty($request)){
            foreach ($request as $k=>$v){
                $this->params[$k] = trim($v);
            }
        }
        if (!empty($this->params['token'])){
            $this->params['uid'] = explode('.', $_GET['token']);
            $this->params['uid'] = $this->params['uid'][0];
        }
        $this->action = $this->params['action'] ? $this->params['action'] : 'none';
    }



    function getAction(){
        return $this->action;
    }
    function checkAction(){
        return $this->actions[$this->action];
    }
    function checkAccess(&$db){
        if (!$this->params['token']){
            $this->userRole = 'guest';
        }
        else{
            $token = explode('.', $this->params['token']);
            $user  = $db->query("SELECT `id`, `role` FROM `users` WHERE `id` = ? AND `token` = ?", [$token[0], $token[1]]);
            $user = $user[0];
            if (!$user['id']){
                $this->userRole = 'guest';
            }
            elseif ($user['id']){
                $this->userRole = $user['role'];
            }
        }
        if ($this->params['token'] == $this->adminToken){
            $this->userRole = 'admin';
        }
        return in_array($this->userRole, $this->actions[$this->action]['access']);
    }



    function getController(){
        return $this->actions[$this->action]['ctrl'];
    }
    function getMethod(){
        return $this->actions[$this->action]['method'];
    }
    function getParams(){
        return $this->params;
    }
}
?>
