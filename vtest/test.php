<?php
/**
 * Created by PhpStorm.
 * User: feipai1
 * Date: 2017/11/23
 * Time: 18:28
 */

/* 常量 */
require_once ROOT_PATH.'source/include/inc_constant.php';
$start = microtime(true);

exec(KRPANO." "."./hasSky_1511431246.JPG");

$elapsed = microtime(true) - $start;
echo "That took $elapsed seconds.\n";

// 获得微妙方法
function getMillisecond()
{
    list($s1, $s2) = explode(' ', microtime());
    return (float)sprintf('%.0f', (floatval($s1) + floatval($s2)) * 1000);
}