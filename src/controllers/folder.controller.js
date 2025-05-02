const express = require('express')
const { CREATED, SuccessResponse } = require('../core/success.response')
const FolderService = require('../services/folder.service')

class FolderController {
    createFolder = async (req, res) => {
        new CREATED({
            metadata: await FolderService.createFolder(req.body.name, req.user.userId)
        }).send(res)
    }

    getFoldersByUserId = async (req, res) => {
        new SuccessResponse({
            metadata: await FolderService.getFoldersByUserId(req.user.userId)
        }).send(res)
    }

    getDocumentsByFolderId = async (req, res) => {
        new SuccessResponse({
            metadata: await FolderService.getDocumentByFolderId(req.params.id)
        }).send(res)
    }

    deleteFolder = async (req, res) => {
        new SuccessResponse({
            message: "Delete folder successfully!"
        }).send(res)
    }
}

module.exports = new FolderController()