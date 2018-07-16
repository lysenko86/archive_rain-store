<?php
class Products{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function getProducts(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `products` ORDER BY `id` ASC", []);
        $this->data['status'] = 'success';
    }
    function getProduct(){
        $this->data['arr']    = $this->db->query("SELECT * FROM `products` WHERE `id` = ?", [$this->params['id']]);
        $this->data['arr']    = $this->data['arr'][0];
        $this->data['status'] = 'success';
    }
}
?>
