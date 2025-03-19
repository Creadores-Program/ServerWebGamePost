<?php
echo "Empaquetando PHAR...\n";
$pharFile = "ServerWebGamePost-1.2.1.phar";
$phar = new Phar($pharFile);
$phar->setAlias("ServerWebGamePost-1.2.1.phar");
$phar->buildFromDirectory(dirname(__FILE__) . '/ServerWebGamePost');
if (Phar::canCompress(Phar::GZ)) {
    $phar->compressFiles(Phar::GZ);
} elseif (Phar::canCompress(Phar::BZ2)) { 
    $phar->compressFiles(Phar::BZ2); 
}
$phar->setStub("<?php __HALT_COMPILER(); ?>");
echo "Done!\n";
?>