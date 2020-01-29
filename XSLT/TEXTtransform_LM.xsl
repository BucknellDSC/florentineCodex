<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs tei" 
    version="2.0">
    
    <xsl:output omit-xml-declaration="yes" method="text" encoding="UTF-8"/>
    <xsl:strip-space elements="*"/>
   
    
    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
        
    <xsl:template match="tei:teiHeader"/>
    
    <xsl:template match="*">
        <xsl:apply-templates/>
        <xsl:text> </xsl:text>
    </xsl:template>
    
    <xsl:template match="tei:div2">
            <xsl:apply-templates/>
        
    </xsl:template>
    
    <xsl:template match="tei:div2">
        <br />
        <xsl:text>Chapter #</xsl:text>
        <br />
        <xsl:apply-templates/>
    </xsl:template>

<!-- 'tokenize' removes punctuation; remove the tokenize function if you want punctuation in text -->
    <xsl:template match="text()">
        <xsl:value-of select="tokenize(., '\W')"/>
    </xsl:template>
   
</xsl:stylesheet>