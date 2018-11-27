<?php
class Orders{
    private $params = [];
    private $data   = [];
    private $db     = NULL;
    function __construct($params, &$data, &$db){
        $this->params = $params;
        $this->data   = &$data;
        $this->db     = &$db;
    }
    function createOrder(){
        $uid      = $this->params['uid'] == 'null' ? '-1' : $this->params['uid'];
        $products = json_decode($this->params['products']);
        $date     = date("Y-m-d H:i:s");
        $oid      = $this->db->query(
            "INSERT INTO `orders` (`uid`, `created`, `status`, `fio`, `phone`, `delivery`, `city`, `department`, `payType`, `comment`, `sum`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$uid, $date, 'confirming', $this->params['fio'], $this->params['phone'], $this->params['delivery'], $this->params['city'], $this->params['department'], $this->params['payType'], $this->params['comment'], $this->params['sum']], NULL, true
        );
        $queriesArr = '';
        $dataArr = [];
        for ($i=0; $i<count($products); $i++){
            $queriesArr .= "INSERT INTO `orders_products` (`oid`, `pid`, `price`, `count`) VALUES(?, ?, ?, ?); ";
            array_push($dataArr, $oid, $products[$i]->id, $products[$i]->price, $products[$i]->count);
        }
        $this->db->query($queriesArr, $dataArr, NULL, true);

        $sms = new SMSclient('', '', '3f7dfef5ab1db7fe0a167d75025574543c7f85e7');
        $sms->sendSMS('RainStore', '380686178656', 'Замовлення №' . $oid . ' на сумму ' . $this->params['sum'] . 'грн, тел: ' . $this->params['phone'] . '.');
        $sms->sendSMS('RainStore', str_replace('+', '', $this->params['phone']), 'Замовлення №' . $oid . ' на суму ' . $this->params['sum'] . 'грн. успішно оформлене. Дякуємо!');
        /*$id = $sms->sendSMS('RainStore', '380XXXXXXXXX', 'Текст сообщения на русском языка в UTF-8 любой длинны');
        if($sms->hasErrors()){
            var_dump($sms->getErrors());
        }
        else{
            var_dump($id);
        }
        exit;*/

        if ($uid != '-1'){
            $email = $this->db->query("SELECT `email` FROM `users` WHERE `id` = ?", [$uid]);
            $email = $email[0]['email'];
            $this->data['arr'] = $this->data['arr'][0];
            $subject = 'RainStore.com.ua - Оформлення замовлення';
            $mail    = "Дякуємо за ваше замовлення, наші менеджери дуже скоро звʼяжуться з вами.\n\nНомер вашого замовлення: {$oid}" . ($this->params['payType'] == 'cash' ? "\nСума до оплати: {$this->params['sum']}грн. + доставка" : '');
            mail($email, $subject, $mail);
        }
        $this->data['status'] = 'success';
        $this->data['msg']    = "Готово! Замовлення успішно створено." . ($this->params['payType'] == 'card' ? ' Зараз вас буде перенаправлено на сторінку оплати.' : '');
    }
    function getOrders(){
        if (!$this->params['userId']){
            $this->data['arr'] = $this->db->query("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y') AS `created` FROM `orders` ORDER BY `id` DESC", []);
        }
        else{
            $this->data['arr'] = $this->db->query("SELECT *, DATE_FORMAT(`created`, '%d.%m.%Y') AS `created` FROM `orders` WHERE `uid` = ? ORDER BY `id` ASC", [$this->params['userId']]);
        };
        $this->data['status'] = 'success';
    }
    function getOrderProducts(){
        $this->data['arr'] = $this->db->query("
            SELECT
                `op`.*, `p`.`title`, `p`.`image`
            FROM `orders_products` AS `op`
                LEFT JOIN `products` AS `p` ON (`p`.`id` = `op`.`pid`)
            WHERE `op`.`oid` = ?
        ", [$this->params['id']]);
        $this->data['status'] = 'success';
    }
    function changeOrderStatus(){
        $this->db->query("UPDATE `orders` SET `status` = ? WHERE `id` = ?", [$this->params['status'], $this->params['oid']]);
        $this->data['status'] = 'success';
    }
}
?>
