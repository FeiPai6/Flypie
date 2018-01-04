<?php
/*
 * json类 
 * @author  08.27.2015
*/
if(!defined('IN_T'))
{
  die('禁止访问！');
}

class Json{
    
	//编码
    public function encode($arg,$option=null)
    {
   

        if (function_exists('json_encode'))
        {  
            //return json_encode($this->addslashes_deep_obj($arg));  //对$arg中的预定义字符添加反斜杠
			return $option==null?json_encode($arg):json_encode($arg,$option);
        }
		return false;
    }
	
    //type=1解码为array,type=0解码为obj
	//默认编码为array
    public function decode($text,$type=1) 
    { 
        if (empty($text))
        {
            return '';
        }
        elseif (!is_string($text))
        {
            return false;
        }

        if (function_exists('json_decode'))
        { 
			//return $this->stripslashes_deep_obj(json_decode($text,$type));   //去除$text中被addslashes()添加的反斜杠
			return json_decode($text,$type);
        }
		return false;
    }		

	 /**
	  * 递归方式的对变量中的特殊字符进行转义
	  *
	  * @access  public
	  * @param   mix     $value
	  *
	  * @return  mix
	  */
	  private function addslashes_deep($value)
	  { 
		if (empty($value))
		{
			return $value;
		}
		else
		{  
			return is_array($value) ? array_map(array($this,'addslashes_deep'),$value) : (is_string($value)? addslashes($value): $value);
		}
	  }
	
	  /**
	   * 将对象成员变量或者数组的特殊字符进行转义
	   * 
	   * @access   public
	   * @param    mix        $obj      对象或者数组
	   * @author   Xuan Yan
	   *
	   * @return   mix                  对象或者数组
	  */
	  private function addslashes_deep_obj($obj)
	  {
		if (is_object($obj) == true)
		{
			foreach ($obj as $key => $val)
			{
				$obj->$key = $this->addslashes_deep($val);
			}
		}
		else
		{
			$obj = $this->addslashes_deep($obj);
		}
	
		return $obj;
	  }
	  
	  /**
	  * 递归方式的对变量中的特殊字符进行反转义
	  *
	  * @access  public
	  * @param   mix     $value
	  *
	  * @return  mix
	  */
	  private function stripslashes_deep($value)
	  { 
		if (empty($value))
		{
			return $value;
		}
		else
		{  
			return is_array($value) ? array_map(array($this,'stripslashes_deep'),$value) : (is_string($value)? stripslashes($value): $value);
		}
	  }
	
	  /**
	   * 将对象成员变量或者数组的特殊字符进行反转义
	   * 
	   * @access   public
	   * @param    mix        $obj      对象或者数组
	   * @author   Xuan Yan
	   *
	   * @return   mix                  对象或者数组
	  */
	  private function stripslashes_deep_obj($obj)
	  {
		if (is_object($obj) == true)
		{
			foreach ($obj as $key => $val)
			{
				$obj->$key = $this->stripslashes_deep($val);
			}
		}
		else
		{
			$obj = $this->stripslashes_deep($obj);
		}
	
		return $obj;
	  }
	  /************************************************************** 
	   * 
	   *  使用特定function对数组中所有元素做处理 
	   *  @param  string  &$array     要处理的字符串 
	   *  @param  string  $function   要执行的函数 
	   *  @return boolean $apply_to_keys_also     是否也应用到key上 
	   *  @access public 
	   * 
	   *************************************************************/
	 private function arrayRecursive(&$array, $function, $apply_to_keys_also = false){  
	    static $recursive_counter = 0;  
	    if (++$recursive_counter > 1000) {  
	        die('possible deep recursion attack');  
	    }  
	    foreach ($array as $key => $value) {  
	        if (is_array($value)) {  
	            $this->arrayRecursive($array[$key], $function, $apply_to_keys_also);  
	        } else {  
	            $array[$key] = $function($value);  
	        }  
	   
	        if ($apply_to_keys_also && is_string($key)) {  
	            $new_key = $function($key);  
	            if ($new_key != $key) {  
	                $array[$new_key] = $array[$key];  
	                unset($array[$key]);  
	            }  
	        }  
	    }  
	    $recursive_counter--;  
	}  
	public function encode_unescaped_unicode($array) {
	    $this->arrayRecursive($array, 'urlencode', true);  
	    $json = json_encode($array);  
	    return urldecode($json);  
	} 
}
?>