<?php
/**
 * 定义常量
 * @author  
**/

//定义krpano切图临时文件存储路径
define('KRTEMP', ROOT_PATH.'temp/krpano');

//定义krpano位置
if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {    //windows系统
    define('KRPANO',ROOT_PATH.'data/krpano/make.bat');
} else if (strtoupper(substr(PHP_OS, 0, 3)) == 'DAR') {    //Mac系统
    define('KRPANO',ROOT_PATH.'data/krpano_mac/make.sh');
} else {
    define('KRPANO',ROOT_PATH.'data/krpano_linux/make.sh');  //linux系统
}
?>