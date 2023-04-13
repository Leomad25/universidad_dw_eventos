<?php 

class GenerateResponsive
{
    private ?Responsive $responsive = null;
    private ?object $data = null;

    public function __construct()
    {
        $this->generateResponsive(null, null, null);
    }

    public function generateResponsive(?int $code, ?string $message, ?object $data)
    {
        if ($data != null)
        {
            $this->responsive = new Responsive(1,'Suc: Data load');
            $this->data = $data;
        } else {
            $this->data = null;
            if ($code == null) {
                $this->responsive = new Responsive(-1,'Err: Data empty');
            } else {
                if ($message == null)
                {
                    if ($code <= 0)
                    {
                        $this->responsive = new Responsive($code,'Err: General error');
                    } else {
                        $this->responsive = new Responsive(1,'Suc: Data load');
                    }
                } else {
                    $this->responsive = new Responsive($code,$message);
                }
            }
        }
    }

    public function getJson(): string
    {
        $arr = array('responsive' => $this->responsive->getData(), 'data' => $this->data);
        return json_encode($arr);
    }
}

class Responsive {
    private int $code = -1;
    private string $message = 'Err: General error';

    public function __construct(?int $code, ?string $message)
    {
        if ($code != null) $this->code = $code;
        if ($message != null) $this->message = $message;
    }

    public function getData(): array
    {
        return array('code' => $this->code, 'message' => $this->message);
    }
}

?>