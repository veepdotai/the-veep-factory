<?php
/**
 * BackupService
 * PHP version 5
 *
 * @category Class
 * @package  InfluxDB2
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 */

/**
 * InfluxDB OSS API Service
 *
 * The InfluxDB v2 API provides a programmatic interface for all interactions with InfluxDB. Access the InfluxDB API using the `/api/v2/` endpoint.
 *
 * OpenAPI spec version: 2.0.0
 * 
 * Generated by: https://openapi-generator.tech
 * OpenAPI Generator version: 3.3.4
 */

/**
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

namespace InfluxDB2\Service;

use InfluxDB2\DefaultApi;
use InfluxDB2\HeaderSelector;
use InfluxDB2\ObjectSerializer;

/**
 * BackupService Class Doc Comment
 *
 * @category Class
 * @package  InfluxDB2
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 */
class BackupService
{
    /**
     * @var DefaultApi
     */
    protected $defaultApi;

    /**
     * @var HeaderSelector
     */
    protected $headerSelector;

    /**
     * @param DefaultApi $defaultApi
     * @param HeaderSelector  $selector
     */
    public function __construct(DefaultApi $defaultApi)
    {
        $this->defaultApi = $defaultApi;
        $this->headerSelector = new HeaderSelector();
    }


    /**
     * Operation getBackupKV
     *
     * Download snapshot of metadata stored in the server's embedded KV store. Don't use with InfluxDB versions greater than InfluxDB 2.1.x.
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return \SplFileObject|string
     */
    public function getBackupKV($zap_trace_span = null)
    {
        list($response) = $this->getBackupKVWithHttpInfo($zap_trace_span);
        return $response;
    }

    /**
     * Operation getBackupKVWithHttpInfo
     *
     * Download snapshot of metadata stored in the server's embedded KV store. Don't use with InfluxDB versions greater than InfluxDB 2.1.x.
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return array of \SplFileObject|string, HTTP status code, HTTP response headers (array of strings)
     */
    public function getBackupKVWithHttpInfo($zap_trace_span = null)
    {
        $request = $this->getBackupKVRequest($zap_trace_span);

        $response = $this->defaultApi->sendRequest($request);

        $returnType = '\SplFileObject';
        $responseBody = $response->getBody();
        if ($returnType === '\SplFileObject') {
            $content = $responseBody; //stream goes to serializer
        } else {
            $content = $responseBody->getContents();
        }

        return [
            ObjectSerializer::deserialize($content, $returnType, []),
            $response->getStatusCode(),
            $response->getHeaders()
        ];
    }

    /**
     * Create request for operation 'getBackupKV'
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     *
     * @throws \InvalidArgumentException
     * @return \Psr\Http\Message\RequestInterface
     */
    protected function getBackupKVRequest($zap_trace_span = null)
    {

        $resourcePath = '/api/v2/backup/kv';
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;

        // header params
        if ($zap_trace_span !== null) {
            $headerParams['Zap-Trace-Span'] = ObjectSerializer::toHeaderValue($zap_trace_span);
        }


        // body params
        $_tempBody = null;

        if ($multipart) {
            $headers = $this->headerSelector->selectHeadersForMultipart(
                ['application/octet-stream', 'application/json']
            );
        } else {
            $headers = $this->headerSelector->selectHeaders(
                ['application/octet-stream', 'application/json'],
                []
            );
        }

        // for model (json/xml)
        if (isset($_tempBody)) {
            // $_tempBody is the method argument, if present
            if ($headers['Content-Type'] === 'application/json') {
                $httpBody = json_encode(ObjectSerializer::sanitizeForSerialization($_tempBody));
            } else {
                $httpBody = $_tempBody;
            }
        }

        $headers = array_merge(
            $headerParams,
            $headers
        );

        return $this->defaultApi->createRequest('GET', $resourcePath, $httpBody, $headers, $queryParams);
    }

    /**
     * Operation getBackupMetadata
     *
     * Download snapshot of all metadata in the server
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return \InfluxDB2\Model\MetadataBackup|string
     */
    public function getBackupMetadata($zap_trace_span = null, $accept_encoding = 'identity')
    {
        list($response) = $this->getBackupMetadataWithHttpInfo($zap_trace_span, $accept_encoding);
        return $response;
    }

    /**
     * Operation getBackupMetadataWithHttpInfo
     *
     * Download snapshot of all metadata in the server
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return array of \InfluxDB2\Model\MetadataBackup|string, HTTP status code, HTTP response headers (array of strings)
     */
    public function getBackupMetadataWithHttpInfo($zap_trace_span = null, $accept_encoding = 'identity')
    {
        $request = $this->getBackupMetadataRequest($zap_trace_span, $accept_encoding);

        $response = $this->defaultApi->sendRequest($request);

        $returnType = '\InfluxDB2\Model\MetadataBackup';
        $responseBody = $response->getBody();
        if ($returnType === '\SplFileObject') {
            $content = $responseBody; //stream goes to serializer
        } else {
            $content = $responseBody->getContents();
        }

        return [
            ObjectSerializer::deserialize($content, $returnType, []),
            $response->getStatusCode(),
            $response->getHeaders()
        ];
    }

    /**
     * Create request for operation 'getBackupMetadata'
     *
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     *
     * @throws \InvalidArgumentException
     * @return \Psr\Http\Message\RequestInterface
     */
    protected function getBackupMetadataRequest($zap_trace_span = null, $accept_encoding = 'identity')
    {

        $resourcePath = '/api/v2/backup/metadata';
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;

        // header params
        if ($zap_trace_span !== null) {
            $headerParams['Zap-Trace-Span'] = ObjectSerializer::toHeaderValue($zap_trace_span);
        }
        // header params
        if ($accept_encoding !== null) {
            $headerParams['Accept-Encoding'] = ObjectSerializer::toHeaderValue($accept_encoding);
        }


        // body params
        $_tempBody = null;

        if ($multipart) {
            $headers = $this->headerSelector->selectHeadersForMultipart(
                ['multipart/mixed', 'application/json']
            );
        } else {
            $headers = $this->headerSelector->selectHeaders(
                ['multipart/mixed', 'application/json'],
                []
            );
        }

        // for model (json/xml)
        if (isset($_tempBody)) {
            // $_tempBody is the method argument, if present
            if ($headers['Content-Type'] === 'application/json') {
                $httpBody = json_encode(ObjectSerializer::sanitizeForSerialization($_tempBody));
            } else {
                $httpBody = $_tempBody;
            }
        }

        $headers = array_merge(
            $headerParams,
            $headers
        );

        return $this->defaultApi->createRequest('GET', $resourcePath, $httpBody, $headers, $queryParams);
    }

    /**
     * Operation getBackupShardId
     *
     * Download snapshot of all TSM data in a shard
     *
     * @param  int $shard_id The shard ID. (required)
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     * @param  \DateTime $since The earliest time [RFC3339 date/time format](https://docs.influxdata.com/influxdb/v2.3/reference/glossary/#rfc3339-timestamp) to include in the snapshot. (optional)
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return \SplFileObject|\InfluxDB2\Model\Error|string
     */
    public function getBackupShardId($shard_id, $zap_trace_span = null, $accept_encoding = 'identity', $since = null)
    {
        list($response) = $this->getBackupShardIdWithHttpInfo($shard_id, $zap_trace_span, $accept_encoding, $since);
        return $response;
    }

    /**
     * Operation getBackupShardIdWithHttpInfo
     *
     * Download snapshot of all TSM data in a shard
     *
     * @param  int $shard_id The shard ID. (required)
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     * @param  \DateTime $since The earliest time [RFC3339 date/time format](https://docs.influxdata.com/influxdb/v2.3/reference/glossary/#rfc3339-timestamp) to include in the snapshot. (optional)
     *
     * @throws \InfluxDB2\ApiException on non-2xx response
     * @throws \InvalidArgumentException
     * @return array of \SplFileObject|\InfluxDB2\Model\Error|string, HTTP status code, HTTP response headers (array of strings)
     */
    public function getBackupShardIdWithHttpInfo($shard_id, $zap_trace_span = null, $accept_encoding = 'identity', $since = null)
    {
        $request = $this->getBackupShardIdRequest($shard_id, $zap_trace_span, $accept_encoding, $since);

        $response = $this->defaultApi->sendRequest($request);

        $returnType = '\SplFileObject';
        $responseBody = $response->getBody();
        if ($returnType === '\SplFileObject') {
            $content = $responseBody; //stream goes to serializer
        } else {
            $content = $responseBody->getContents();
        }

        return [
            ObjectSerializer::deserialize($content, $returnType, []),
            $response->getStatusCode(),
            $response->getHeaders()
        ];
    }

    /**
     * Create request for operation 'getBackupShardId'
     *
     * @param  int $shard_id The shard ID. (required)
     * @param  string $zap_trace_span OpenTracing span context (optional)
     * @param  string $accept_encoding Indicates the content encoding (usually a compression algorithm) that the client can understand. (optional, default to 'identity')
     * @param  \DateTime $since The earliest time [RFC3339 date/time format](https://docs.influxdata.com/influxdb/v2.3/reference/glossary/#rfc3339-timestamp) to include in the snapshot. (optional)
     *
     * @throws \InvalidArgumentException
     * @return \Psr\Http\Message\RequestInterface
     */
    protected function getBackupShardIdRequest($shard_id, $zap_trace_span = null, $accept_encoding = 'identity', $since = null)
    {
        // verify the required parameter 'shard_id' is set
        if ($shard_id === null || (is_array($shard_id) && count($shard_id) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $shard_id when calling getBackupShardId'
            );
        }

        $resourcePath = '/api/v2/backup/shards/{shardID}';
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;

        // query params
        if ($since !== null) {
            $queryParams['since'] = ObjectSerializer::toQueryValue($since);
        }
        // header params
        if ($zap_trace_span !== null) {
            $headerParams['Zap-Trace-Span'] = ObjectSerializer::toHeaderValue($zap_trace_span);
        }
        // header params
        if ($accept_encoding !== null) {
            $headerParams['Accept-Encoding'] = ObjectSerializer::toHeaderValue($accept_encoding);
        }

        // path params
        if ($shard_id !== null) {
            $resourcePath = str_replace(
                '{' . 'shardID' . '}',
                ObjectSerializer::toPathValue($shard_id),
                $resourcePath
            );
        }

        // body params
        $_tempBody = null;

        if ($multipart) {
            $headers = $this->headerSelector->selectHeadersForMultipart(
                ['application/octet-stream', 'application/json']
            );
        } else {
            $headers = $this->headerSelector->selectHeaders(
                ['application/octet-stream', 'application/json'],
                []
            );
        }

        // for model (json/xml)
        if (isset($_tempBody)) {
            // $_tempBody is the method argument, if present
            if ($headers['Content-Type'] === 'application/json') {
                $httpBody = json_encode(ObjectSerializer::sanitizeForSerialization($_tempBody));
            } else {
                $httpBody = $_tempBody;
            }
        }

        $headers = array_merge(
            $headerParams,
            $headers
        );

        return $this->defaultApi->createRequest('GET', $resourcePath, $httpBody, $headers, $queryParams);
    }

}