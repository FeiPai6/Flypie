<?php
/**
 * 数据库类
 * author  @2.16.2013
*/
class MyPDO
{
    protected static $_instance = null;
    protected $dbName = '';
    protected $dsn;
    protected $dbh;
    
    /**
     * 私有化构造方法
     * @return MyPDO
     */
    private function __construct($dbHost, $dbUser, $dbPasswd, $dbName, $dbCharset)
    {
        try {
            $this->dsn = 'mysql:host='.$dbHost.';dbname='.$dbName;
            $this->dbh = new PDO($this->dsn, $dbUser, $dbPasswd);
            $this->dbh->exec('SET character_set_connection='.$dbCharset.', character_set_results='.$dbCharset.', character_set_client=binary');
        }catch(PDOException $e){
            $this->outputError($e->getMessage());
        }
    }
    
    /**
     * 防止克隆
     *
     */
    private function __clone(){}
    
    /**
     * Singleton instance
     *
     * @return Object
     */
    public static function getInstance($dbHost, $dbUser, $dbPasswd, $dbName, $dbCharset)
    {
        if (self::$_instance === null) {
            self::$_instance = new self($dbHost, $dbUser, $dbPasswd, $dbName, $dbCharset);
        }
        return self::$_instance;
    }
    
    /**
     * Query 查询
     *
     * @param String $strSql SQL语句
     * @param String $queryMode 查询方式(All or Row)
     * @param Boolean $debug
     * @return Array
     */
    public function query($strSql, $queryMode = 'All', $debug = false)
    {
        if ($debug === true) $this->debug($strSql);       
        $recordset = $this->dbh->query($strSql);
        $this->getPDOError();
        if ($recordset){
            if ($queryMode == 'All') {
                 $recordset->setFetchMode(PDO::FETCH_ASSOC);
                $result = $recordset->fetchAll();
            } 
			else if($queryMode == 'Row') {
                 $recordset->setFetchMode(PDO::FETCH_ASSOC);
                $result = $recordset->fetch();
            }
			else if($queryMode == 'One'){
                 $recordset->setFetchMode(PDO::FETCH_NUM);
				$result = $recordset->fetch();
				$result = $result[0];
			}
        } 
		else{
            $result = null;
        }
        return $result;
    }
    
    /**
     * Update 更新
     *
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param String $where 条件
     * @param Boolean $debug
     * @return Int
     */
    public function update($table, $arrayDataValue, $where = array(), $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        if($where){
            $strSql = '';
            foreach($arrayDataValue as $key => $value){
                $strSql .= ", `$key`='$value'";
            }
            $strSql = substr($strSql, 1);
			$wheSql = '';
			foreach($where as $key=>$value){
				$wheSql .= "and `$key`='$value'";	
			}
			$wheSql = substr($wheSql,3);
            $strSql = "UPDATE $table SET $strSql WHERE $wheSql";
        }else 
		{
            $strSql = "REPLACE INTO $table (`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        }
        if ($debug === true) $this->debug($strSql);
        $result = $this->dbh->exec($strSql);
        $this->getPDOError();
        return $result;
    }
    
    /**
     * Insert 插入
     *
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param Boolean $debug
     * @return Int
     */
    public function insert($table, $arrayDataValue, $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        $strSql = "INSERT INTO $table (`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        if ($debug === true) $this->debug($strSql);
        $result = $this->dbh->exec($strSql);
        $this->getPDOError();
        return $result>0?$this->dbh->lastInsertId():0;
    }
    
    /**
     * Replace 覆盖方式插入
     *
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param Boolean $debug
     * @return Int
     */
    public function replace($table, $arrayDataValue, $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        $strSql = "REPLACE INTO $table(`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        if ($debug === true) $this->debug($strSql);
        $result = $this->dbh->exec($strSql);
        $this->getPDOError();
        return $result;
    }
    
    /**
     * Delete 删除
     *
     * @param String $table 表名
     * @param String $where 条件
     * @param Boolean $debug
     * @return Int
     */
    public function delete($table, $where = array(), $debug = false)
    {
        if($where){
			$wheSql = '';
			foreach($where as $key=>$value){
				$wheSql .= "and `$key`='$value'";	
			}
			$wheSql = substr($wheSql,3);
			$strSql = "DELETE FROM $table WHERE $wheSql";
            if ($debug === true) $this->debug($strSql);
            $result = $this->dbh->exec($strSql);
            $this->getPDOError();
            return $result;           
        }else 
		{
            $this->outputError("'WHERE' is Null");
        }
    }
    
    /**
     * execSql 执行SQL语句
     *
     * @param String $strSql
     * @param Boolean $debug
     * @return Int
     */
    public function execSql($strSql, $debug = false)
    {
        if ($debug === true) $this->debug($strSql);
        $result = $this->dbh->exec($strSql);
        $this->getPDOError();
        return $result;
    }
    
    /**
     * 获取字段最大值
     *
     * @param string $table 表名
     * @param string $field_name 字段名
     * @param string $where 条件
     */
    public function getMaxValue($table, $field_name, $where = array(), $debug = false)
    {
        $strSql = "SELECT MAX(".$field_name.") AS MAX_VALUE FROM $table";
        if($where){
			$wheSql = '';
			foreach($where as $key=>$value){
				$wheSql .= "and `$key`='$value'";	
			}
			$wheSql = substr($wheSql,3);
			$strSql .= " WHERE $wheSql";
        }
		if ($debug === true) $this->debug($strSql);
        $arrTemp = $this->query($strSql, 'Row');
        $maxValue = $arrTemp["MAX_VALUE"];
        if ($maxValue == "" || $maxValue == null) {
            $maxValue = 0;
        }
        return $maxValue;
    }
    
    /**
     * 获取指定列的数量
     *
     * @param string $table
     * @param string $field_name
     * @param string $where
     * @param bool $debug
     * @return int
     */
    public function getCount($table, $field_name, $where = array(), $debug = false)
    {
        $strSql = "SELECT COUNT($field_name) AS NUM FROM $table";
        if($where){
			$wheSql = '';
			foreach($where as $key=>$value){
				$wheSql .= "and `$key`='$value'";	
			}
			$wheSql = substr($wheSql,3);
			$strSql .= " WHERE $wheSql";
		}
        if ($debug === true) $this->debug($strSql);
        $arrTemp = $this->query($strSql, 'Row');
        return $arrTemp['NUM'];
    }
    
    /**
     * 获取表引擎
     *
     * @param String $dbName 库名
     * @param String $tableName 表名
     * @param Boolean $debug
     * @return String
     */
    public function getTableEngine($dbName, $tableName)
    {
        $strSql = "SHOW TABLE STATUS FROM $dbName WHERE Name='".$tableName."'";
        $arrayTableInfo = $this->query($strSql);
        $this->getPDOError();
        return $arrayTableInfo[0]['Engine'];
    }
    
    /**
     * beginTransaction 事务开始
     */
    public function beginTransaction()
    {
        $this->dbh->beginTransaction();
    }
    
    /**
     * commit 事务提交
     */
    public function commit()
    {
        $this->dbh->commit();
    }
    
    /**
     * rollback 事务回滚
     */
    public function rollback()
    {
        $this->dbh->rollback();
    }
    
    /**
     * transaction 通过事务处理多条SQL语句
     * 调用前需通过getTableEngine判断表引擎是否支持事务
     *
     * @param array $arraySql
     * @return Boolean
     */
    public function execTransaction($arraySql)
    {
        $retval = 1;
        $this->beginTransaction();
        foreach ($arraySql as $strSql) {
            if ($this->execSql($strSql) == 0) $retval = 0;
        }
        if ($retval == 0) {
            $this->rollback();
            return false;
        } else {
            $this->commit();
            return true;
        }
    }
 
    /**
     * checkFields 检查指定字段是否在指定数据表中存在
     *
     * @param String $table
     * @param array $arrayField
     */
    private function checkFields($table, $arrayFields)
    {
        $fields = $this->getFields($table);
        foreach ($arrayFields as $key => $value) {
            if (!in_array($key, $fields)) {
                $this->outputError("Unknown column `$key` in $table field list.");
            }
        }
    }
    
    /**
     * getFields 获取指定数据表中的全部字段名
     *
     * @param String $table 表名
     * @return array
     */
    private function getFields($table)
    {
        $fields = array();
        $recordset = $this->dbh->query("SHOW COLUMNS FROM $table");
        $this->getPDOError();
        $recordset->setFetchMode(PDO::FETCH_ASSOC);
        $result = $recordset->fetchAll();
        foreach ($result as $rows) {
            $fields[] = $rows['Field'];
        }
        return $fields;
    }
    
    /**
     * getPDOError 捕获PDO错误信息
     */
    private function getPDOError()
    {
        if ($this->dbh->errorCode() != '00000') {
            $arrayError = $this->dbh->errorInfo();
            $this->outputError($arrayError[2]);
        }
    }
    
    /**
     * debug
     *
     * @param mixed $debuginfo
     */
    private function debug($debuginfo)
    {
        var_dump($debuginfo);
        exit();
    }
    
    /**
     * 输出错误信息
     *
     * @param String $strErrMsg
     */
    private function outputError($strErrMsg)
    {
        throw new Exception('MySQL Error: '.$strErrMsg);
    }
    
    /**
     * destruct 关闭数据库连接
     */
    public function destruct()
    {
        $this->dbh = null;
    }
}
?>