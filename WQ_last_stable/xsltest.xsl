<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="xml" encoding="utf-8"/>

<xsl:template match="/">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl">
<head><title><xsl:value-of select="/data/test"/></title></head>
<body>
<div><xsl:value-of select="/data/test"/></div>
</body>

</html>

</xsl:template>
</xsl:stylesheet>