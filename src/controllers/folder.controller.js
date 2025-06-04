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
        try {
            const result = await FolderService.deleteFolder(req.params.id)
            new SuccessResponse({
                metadata: result,
                message: "Delete folder successfully!"
            }).send(res)
        } catch (error) {
            res.status(500).json({ message: "Error deleting folder", error: error.message })
        }
    }

    updateFolder = async (req, res) => {
        try {
            const result = await FolderService.updateFolder(req.params.id, req.body)
            new SuccessResponse({
                metadata: result,
                message: "Update folder successfully!"
            }).send(res)
        } catch (error) {
            res.status(500).json({ message: "Error updating folder", error: error.message })
        }
    }
}

module.exports = new FolderController()