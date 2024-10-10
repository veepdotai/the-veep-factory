<?php

declare(strict_types=1);

namespace Tests\Repository;

use ImgFinder\Repository\ImgRepositoryInterface;
use ImgFinder\RequestInterface;
use ImgFinder\Response;
use ImgFinder\ResponseInterface;

class SpyRepository implements ImgRepositoryInterface
{
    private const NAME = 'spy-repository';


    public function __construct(string $authorization)
    {
    }


    public function name(): string
    {
        return self::NAME;
    }


    public function findImages(RequestInterface $request): ResponseInterface
    {
        return Response::fromUrls([]);
    }
}
